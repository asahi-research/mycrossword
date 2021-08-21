import classNames from 'classnames';
import { cellSize, GridCell, GridSeparators } from 'components';
import Spinner from 'components/Spinner/Spinner';
import type { Cell, CellPosition, Char, Clue, GuardianClue } from 'interfaces';
import * as React from 'react';
import {
  select as cellsActionSelect,
  updateOne as cellsActionUpdateOne,
} from 'redux/cellsSlice';
import { select as cluesActionSelect } from 'redux/cluesSlice';
import { useAppDispatch } from 'redux/hooks';
import { isValidChar } from 'utils/general';
import './Grid.scss';

const appearsInGroup = (clueId: string | undefined, group: string[]) =>
  clueId !== undefined && group.includes(clueId);

const cellPositionMatches = (
  cellPosA: CellPosition,
  cellPosB?: CellPosition,
) => {
  if (cellPosB === undefined) {
    return false;
  }
  return cellPosA.col === cellPosB.col && cellPosA.row === cellPosB.row;
};

interface GridProps {
  cells: Cell[];
  clues: Clue[];
  cols: number;
  isLoading?: boolean;
  rawClues: GuardianClue[];
  rows: number;
}

export default function Grid({
  cells,
  clues,
  cols,
  isLoading = false,
  rawClues,
  rows,
}: GridProps): JSX.Element {
  const dispatch = useAppDispatch();
  const selectedCell = cells.find((cell) => cell.selected);
  const selectedClue = clues.find((clue) => clue.selected);
  const width = cols * cellSize + cols + 1;
  const height = rows * cellSize + rows + 1;

  const movePrev = () => {
    if (selectedClue === undefined || selectedCell === undefined) {
      return;
    }

    const atTheStart =
      (selectedClue.direction === 'across' &&
        selectedCell.pos.col === selectedClue.position.x) ||
      (selectedClue.direction === 'down' &&
        selectedCell.pos.row === selectedClue.position.y);

    if (atTheStart) {
      // if we're at the start of the clue, try to move to the previous
      // one in the group if it exists
      const groupIndex = selectedClue.group.indexOf(selectedClue.id);
      if (groupIndex > 0) {
        const prevClueId = selectedClue.group[groupIndex - 1];
        const prevClue = clues.find((clue) => clue.id === prevClueId);

        if (prevClue !== undefined) {
          dispatch(cluesActionSelect(prevClueId));

          dispatch(
            cellsActionSelect({
              col:
                prevClue.position.x +
                (prevClue.direction === 'across' ? prevClue.length - 1 : 0),
              row:
                prevClue.position.y +
                (prevClue.direction === 'down' ? prevClue.length - 1 : 0),
            }),
          );
        }
      }
    } else {
      // move to the previous cell in the clue
      const cellPos: CellPosition =
        selectedClue.direction === 'across'
          ? { col: selectedCell.pos.col - 1, row: selectedCell.pos.row }
          : { col: selectedCell.pos.col, row: selectedCell.pos.row - 1 };
      dispatch(cellsActionSelect(cellPos));
    }
  };

  const moveNext = () => {
    if (selectedClue === undefined || selectedCell === undefined) {
      return;
    }

    const atTheEnd =
      (selectedClue.direction === 'across' &&
        selectedCell.pos.col ===
          selectedClue.position.x + selectedClue.length - 1) ||
      (selectedClue.direction === 'down' &&
        selectedCell.pos.row ===
          selectedClue.position.y + selectedClue.length - 1);

    if (atTheEnd) {
      // if we're at the end of the clue, try to move onto the next
      // one in the group if it exists
      const groupIndex = selectedClue.group.indexOf(selectedClue.id);
      if (selectedClue.group.length - 1 > groupIndex) {
        const nextClueId = selectedClue.group[groupIndex + 1];
        const nextClue = clues.find((clue) => clue.id === nextClueId);

        if (nextClue !== undefined) {
          dispatch(cluesActionSelect(nextClueId));

          dispatch(
            cellsActionSelect({
              col: nextClue.position.x,
              row: nextClue.position.y,
            }),
          );
        }
      }
    } else {
      // move onto the next cell in the clue
      const cellPos: CellPosition =
        selectedClue.direction === 'across'
          ? { col: selectedCell.pos.col + 1, row: selectedCell.pos.row }
          : { col: selectedCell.pos.col, row: selectedCell.pos.row + 1 };
      dispatch(cellsActionSelect(cellPos));
    }
  };

  /**
   * Find the next cell on the current row/column (wrap on grid overflow)
   * @param {number} colDelta - Horizontal delta (-1, 0, 1)
   * @param {number} rowDelta - Vertical delta (-1, 0, 1)
   */
  const findNextCell = (colDelta: number, rowDelta: number) => {
    const nextPos = (i: number, amount: number, max: number) => {
      const j = i + amount;

      if (j === -1) {
        return max - 1;
      }
      if (j === max) {
        return 0;
      }

      return j;
    };

    let { col, row } = selectedCell?.pos!;

    // loop won't be infinite as it will always wrap and find the selected cell on the same row/col
    // eslint-disable-next-line no-constant-condition
    while (true) {
      if (colDelta === 1 || colDelta === -1) {
        col = nextPos(col, colDelta, cols);
      } else if (rowDelta === 1 || rowDelta === -1) {
        row = nextPos(row, rowDelta, rows);
      }

      const tempCell = cells.find(
        // eslint-disable-next-line @typescript-eslint/no-loop-func
        (cell) => cell.pos.col === col && cell.pos.row === row,
      );

      if (tempCell !== undefined) {
        return tempCell;
      }
    }
  };

  const moveDirection = (direction: string) => {
    if (selectedClue === undefined || selectedCell === undefined) {
      return;
    }
    let nextCell: Cell | undefined;

    switch (direction) {
      case 'Up':
        nextCell = findNextCell(0, -1);
        break;
      case 'Down':
        nextCell = findNextCell(0, 1);
        break;
      case 'Left':
        nextCell = findNextCell(-1, 0);
        break;
      case 'Right':
        nextCell = findNextCell(1, 0);
        break;
      default:
        nextCell = undefined;
    }

    if (nextCell !== undefined) {
      dispatch(cellsActionSelect(nextCell.pos));

      // update the selected clue
      if (!nextCell.clueIds.includes(selectedClue.id)) {
        dispatch(cluesActionSelect(nextCell.clueIds[0]));
      }
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (selectedCell === undefined) {
      return;
    }
    const key = event.key.toUpperCase();

    if (
      ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.code)
    ) {
      // move to the next cell
      moveDirection(event.code.replace('Arrow', ''));
    } else if (['Backspace', 'Delete'].includes(event.code)) {
      // clear the cell's value
      dispatch(
        cellsActionUpdateOne({
          ...selectedCell,
          guess: undefined,
        }),
      );
      if (event.code === 'Backspace') {
        movePrev();
      }
    } else if (event.code === 'Tab') {
      // cycle through the clues
      const index = clues.findIndex((clue) => clue.selected);
      let nextIndex = 0;

      // forwards or backwards
      if (event.shiftKey) {
        nextIndex = index > 0 ? index - 1 : clues.length - 1;
      } else {
        nextIndex = index < clues.length - 1 ? index + 1 : 0;
      }
      const nextClue = clues[nextIndex];

      dispatch(cluesActionSelect(nextClue.id));
      dispatch(
        cellsActionSelect({
          col: nextClue.position.x,
          row: nextClue.position.y,
        }),
      );
    } else if (isValidChar(key)) {
      // overwrite the cell's value
      dispatch(
        cellsActionUpdateOne({
          ...selectedCell,
          guess: key as Char,
        }),
      );

      moveNext();
    }
  };

  return (
    <div
      className={classNames('Grid', isLoading ? 'Grid--loading' : null)}
      onKeyDown={(event) => {
        // prevent keys scrolling page
        event.preventDefault();
        handleKeyPress(event);
      }}
      role="textbox"
      style={{ minWidth: width, minHeight: height, width, height }}
      tabIndex={0}
    >
      {isLoading ? (
        <Spinner size="standard" />
      ) : (
        <svg preserveAspectRatio="xMinYMin" viewBox={`0 0 ${width} ${height}`}>
          <rect
            className="Grid__background"
            onClick={() => {
              // remove focus from grid (TODO: change to use React.forwardRef?)
              document.querySelectorAll<HTMLElement>('.Grid')[0].blur();
            }}
            width={width}
            height={height}
            x="0"
            y="0"
          />
          {cells.map(({ clueIds, groupAcross, groupDown, guess, num, pos }) => {
            const isSelected = cellPositionMatches(pos, selectedCell?.pos);
            const isHighlighted = appearsInGroup(selectedClue?.id, [
              ...(groupAcross !== undefined ? groupAcross : []),
              ...(groupDown !== undefined ? groupDown : []),
            ]);
            const selectedClueIndex =
              selectedClue !== undefined
                ? clueIds.indexOf(selectedClue.id)
                : -1;

            return (
              <GridCell
                clueIds={clueIds}
                guess={guess}
                isSelected={isSelected}
                isHighlighted={isHighlighted}
                key={`${pos.col},${pos.row}`}
                num={num}
                pos={pos}
                selectedClueIndex={selectedClueIndex}
              />
            );
          })}
          <GridSeparators clues={rawClues} />
        </svg>
      )}
    </div>
  );
}
