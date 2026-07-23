export type McSegment = { text: string; color: string; bold: boolean; italic: boolean };

// Legacy per-character format: &#RRGGBB sets color, &l/&o toggle bold/italic,
// &r resets — e.g. "&#EF8EFB&lѕ&#F3AAFC&lᴄ..." (one color per letter).
function parseLegacy(code: string): McSegment[] {
  const segments: McSegment[] = [];
  let color = '#FFFFFF';
  let bold = false;
  let italic = false;
  const re = /&#([0-9a-fA-F]{6})|&([a-zA-Z0-9])|([^&]+)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(code))) {
    if (m[1]) {
      color = `#${m[1]}`;
    } else if (m[2]) {
      const c = m[2].toLowerCase();
      if (c === 'l') bold = true;
      else if (c === 'o') italic = true;
      else if (c === 'r') {
        bold = false;
        italic = false;
        color = '#FFFFFF';
      }
    } else if (m[3]) {
      segments.push({ text: m[3], color, bold, italic });
    }
  }
  return segments;
}

// MiniMessage-lite format: <bold><#RRGGBB>x</#RRGGBB>... — used for a handful
// of ranks. Only supports the flat <bold> + per-char <#HEX> shape we're given.
function parseMiniMessage(code: string): McSegment[] {
  const bold = /<bold>/i.test(code);
  const italic = /<italic>/i.test(code);
  const segments: McSegment[] = [];
  const re = /<#([0-9a-fA-F]{6})>([^<]*)<\/#\1>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(code))) {
    segments.push({ text: m[2], color: `#${m[1]}`, bold, italic });
  }
  return segments;
}

export function parseMcColorCode(code: string): McSegment[] {
  if (!code) return [];
  return code.trim().startsWith('<') ? parseMiniMessage(code) : parseLegacy(code);
}
