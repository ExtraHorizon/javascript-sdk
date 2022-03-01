/* eslint-disable no-bitwise */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

/**
 * Lookup table for btoa(), which converts a six-bit number into the
 * corresponding ASCII character.
 */
const keystr =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

function btoaLookup(index) {
  if (index >= 0 && index < 64) {
    return keystr[index];
  }

  // Throw INVALID_CHARACTER_ERR exception here -- won't be hit in the tests.
  return undefined;
}

/**
 * This implementation is copy pasted from abab
 * https://github.com/jsdom/abab/blob/master/lib/btoa.js
 */
export function btoa(input: string): string {
  let i;
  // String conversion as required by Web IDL.
  const s = `${input}`;
  // "The btoa() method must throw an "InvalidCharacterError" DOMException if
  // data contains any character whose code point is greater than U+00FF."
  for (i = 0; i < s.length; i += 1) {
    if (s.charCodeAt(i) > 255) {
      return null;
    }
  }

  let out = '';
  for (i = 0; i < s.length; i += 3) {
    const groupsOfSix = [undefined, undefined, undefined, undefined];
    groupsOfSix[0] = s.charCodeAt(i) >> 2;
    groupsOfSix[1] = (s.charCodeAt(i) & 0x03) << 4;
    if (s.length > i + 1) {
      groupsOfSix[1] |= s.charCodeAt(i + 1) >> 4;
      groupsOfSix[2] = (s.charCodeAt(i + 1) & 0x0f) << 2;
    }
    if (s.length > i + 2) {
      groupsOfSix[2] |= s.charCodeAt(i + 2) >> 6;
      groupsOfSix[3] = s.charCodeAt(i + 2) & 0x3f;
    }
    for (let j = 0; j < groupsOfSix.length; j += 1) {
      if (typeof groupsOfSix[j] === 'undefined') {
        out += '=';
      } else {
        out += btoaLookup(groupsOfSix[j]);
      }
    }
  }

  return out;
}

export default btoa;
