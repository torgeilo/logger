const GOLDEN_RATIO = 1.618033988749895;

export function supportsStyles(): boolean {
  if (typeof window !== 'undefined' && 'chrome' in window) {
    return true;
  }

  if (typeof navigator !== 'undefined' && /firefox/i.test(navigator.userAgent)) {
    const m = /Firefox\/(\d+\.\d+)/.exec(navigator.userAgent);
    if (m && m[1] && parseFloat(m[1]) >= 31.0) {
      return true;
    }
  }

  return false;
}

export function generateHue(index: number): number {
  return index * GOLDEN_RATIO;
}

export function applyStyle(messages: unknown[], style: { hue?: number; bold?: boolean }): void {
  const css =
    (style.hue !== undefined ? `color:hsl(${style.hue * 360},99%,40%);` : '') +
    (style.bold ? 'font-weight:bold;' : '');

  const startIndex = messages.length - 1;

  for (let i = startIndex; i >= 0; --i) {
    const message = messages[i];
    if (typeof message === 'string') {
      messages.splice(i, 1, `%c${message}`, css);
    }
  }
}
