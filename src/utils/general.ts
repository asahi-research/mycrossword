import sanitize from 'sanitize-html';

export function isValidChar(char: string, type?:number) {
  if (char.length < 1 && 2 < char.length) {
    return false;
  }
  if (type === 1) {
    const whitelist = ['ｂ','ｃ','ｄ','ｆ','ｇ','ｈ','ｊ','ｋ','ｌ','ｍ','ｎ','ｐ','ｑ','ｒ','ｓ','ｔ','ｖ','ｗ','ｘ','ｙ','ｚ','ｂｂ','ｃｃ','ｄｄ','ｆｆ','ｇｇ','ｈｈ','ｊｊ','ｋｋ','ｌｌ','ｍｍ','ｎｎ','ｐｐ','ｑｑ','ｒｒ','ｓｓ','ｔｔ','ｖｖ','ｗｗ','ｘｘ','ｙｙ','ｚｚ','ｂｙ','ｃｙ','ｄｙ','ｆｙ','ｇｙ','ｈｙ','ｊｙ','ｋｙ','ｌｙ','ｍｙ','ｎｙ','ｐｙ','ｑｙ','ｒｙ','ｓｙ','ｔｙ','ｖｙ','ｗｙ','ｘｙ','ｚｙ','ｂｈ','ｃｈ','ｄｈ','ｆｈ','ｇｈ','ｊｈ','ｋｈ','ｌｈ','ｍｈ','ｎｈ','ｐｈ','ｑｈ','ｒｈ','ｓｈ','ｔｈ','ｖｈ','ｗｈ','ｘｈ','ｙｈ','ｚｈ']
    console.log('char:', char)
    return whitelist.includes(char);
  } else {
    const whitelist = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','0','1','2','3','4','5','6','7','8','9','ぁ','ぃ','ぅ','ぇ','ぉ','っ','ゃ','ゅ','ょ','ゎ','あ','い','う','え','お','か','き','く','け','こ','さ','し','す','せ','そ','た','ち','つ','て','と','な','に','ぬ','ね','の','は','ひ','ふ','へ','ほ','ま','み','む','め','も','や','ゆ','よ','ら','り','る','れ','ろ','わ','を','ん','ヴ','が','ぎ','ぐ','げ','ご','ざ','じ','ず','ぜ','ぞ','だ','ぢ','づ','で','ど','ば','び','ぶ','べ','ぼ','ぱ','ぴ','ぷ','ぺ','ぽ','いぇ','うぁ','うぃ','うぇ','うぉ','うゃ','うゅ','うょ','きゃ','きゅ','きぇ','きょ','くぁ','くぃ','くぇ','くぉ','くゎ','しゃ','しゅ','しぇ','しょ','すぁ','すぃ','すぇ','すぉ','すゃ','すゅ','すぃぇ','すょ','ちゃ','ちゅ','ちぇ','ちょ','ちゅぁ','ちゅぃ','ちゅぇ','ちゅぉ','つぁ','つぃ','つぇ','つぉ','てゃ','てぃ','てゅ','てぃぇ','てぇ','てょ','とぁ','とぃ','とぅ','とぇ','にゃ','にゅ','にぇ','にょ','ぬぁ','ぬぃ','ぬぇ','ぬぉ','ひゃ','ひゅ','ひぇ','ひょ','ふぁ','ふぃ','ふぇ','ふぉ','ふゃ','ふゅ','ふぃぇ','ふょ','みゃ','みゅ','みぇ','みょ','むぁ','むぃ','むぇ','むぉ','りゃ','りゅ','りぇ','りょ','るぁ','るぃ','るぇ','るぉ','ヴぁ','ヴぃ','ヴぇ','ヴぉ','ヴゃ','ヴゅ','ヴぃぇ','ヴょ','ぎゃ','ぎゅ','ぎぇ','ぎょ','ぐぁ','ぐぃ','ぐぇ','ぐぉ','ぐゎ','じゃ','じゅ','じぇ','じょ','じゅぁ','じゅぃ','じゅぇ','じゅぉ','ずぁ','ずぃ','ずぇ','ずぉ','ずゃ','ずゅ','ずぃぇ','ずょ','ぢゃ','ぢゅ','ぢぇ','ぢょ','づぁ','づぃ','づぇ','づぉ','でゃ','でぃ','でゅ','でぃぇ','でょ','どぁ','どぃ','どぅ','どぇ','びゃ','びゅ','びぇ','びょ','ぶぁ','ぶぃ','ぶぇ','ぶぉ','ぴゃ','ぴゅ','ぴぇ','ぴょ','ぷぁ','ぷぃ','ぷぇ','ぷぉ','っ'];
    return whitelist.includes(char);
  }
}

export function isInViewport(rect: DOMRect) {
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth) &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
  );
}

export function isInPerimeterRect(rect: DOMRect, perimeterRect: DOMRect) {
  return (
    rect.top >= perimeterRect.top &&
    rect.left >= perimeterRect.left &&
    rect.right <= perimeterRect.right &&
    rect.bottom <= perimeterRect.bottom
  );
}

export function decodeHtmlEntities(html: string) {
  const textArea = document.createElement('textarea');
  textArea.innerHTML = html;
  return textArea.value;
}

export function stripHtml(dirtyHtml: string) {
  return sanitize(dirtyHtml, {
    allowedAttributes: {},
    allowedTags: [],
  });
}

export function sanitizeHtml(dirtyHtml: string) {
  return sanitize(dirtyHtml, {
    allowedAttributes: {},
    allowedTags: ['b', 'strong', 'i', 'em', 'u', 'sub', 'sup'],
  });
}
