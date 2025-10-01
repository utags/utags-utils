export { isValidDate, normalizeCreated, normalizeUpdated } from './date'

/**
 * Trims and normalizes whitespace and invisible characters in a string
 * @param title - The input string to be processed, can be undefined
 * @returns A string with normalized whitespace or empty string if input is undefined
 *
 * Handles the following invisible characters:
 * - Standard whitespace (\s: spaces, tabs, line breaks)
 * - Zero-width spaces (U+200B)
 * - Zero-width non-joiners (U+200C)
 * - Zero-width joiners (U+200D)
 * - Word joiners (U+2060)
 * - Byte order marks/zero-width no-break spaces (U+FEFF)
 * - Bidirectional text marks (U+2066 to U+2069)
 * - And other similar invisible Unicode characters
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export function trimTitle(title: string | undefined | null): string {
  if (!title) return ''
  return (
    title
      // To resolve eslint error - no-misleading-character-class
      .replaceAll('\u200D', ' ')
      .replaceAll(
        /[\s\u200B\u200C\u2060\uFEFF\u2066\u2067\u2068\u2069\u061C\u202A\u202B\u202C\u202D\u202E]+/gm,
        ' '
      )
      .trim()
  )
}

/**
 * Extracts and normalizes text content from an HTML element
 * @param element - The HTML element to extract text from
 * @returns Normalized text content with consistent whitespace
 */
export function getTrimmedTitle(element: HTMLElement) {
  return trimTitle(element.textContent)
}

/**
 * Splits text string, array of strings, or Set of strings into an array of unique tags
 * @param text - Input tags, can be a string, an array of strings, a Set of strings, or undefined
 * @returns Array of unique processed tags
 *
 * Processing rules:
 * 1. If input is an array or Set, it's joined into a single string with commas
 * 2. Normalizes all whitespace (replaces consecutive spaces, tabs with a single space)
 * 3. Splits by delimiters (English/Chinese commas, line breaks)
 * 4. Trims leading and trailing spaces from each tag
 * 5. Filters out empty tags
 * 6. Removes duplicates
 *
 * @example
 * // Basic usage with different separators
 * splitTags('tag1, tag2，tag3')  // ['tag1', 'tag2', 'tag3']
 *
 * // Handling whitespace
 * splitTags('tag  1, tag\t\t2，tag 3')  // ['tag 1', 'tag 2', 'tag 3']
 * splitTags('  tag1  ,  tag1  ') // ['tag1']
 *
 * // Handling line breaks as separators
 * splitTags('tag1\ntag2\rtag3') // ['tag1', 'tag2', 'tag3']
 *
 * // Handling empty tags and duplicates
 * splitTags('tag1,,tag1，，tag2') // ['tag1', 'tag2']
 *
 * // Handling undefined input
 * splitTags(undefined)           // []
 *
 * // Handling mixed separators
 * splitTags('web,前端，javascript\nreact') // ['web', '前端', 'javascript', 'react']
 *
 * // Handling array input
 * splitTags(['tag1', 'tag2', 'tag1']) // ['tag1', 'tag2']
 *
 * // Handling Set input
 * splitTags(new Set(['tag1', 'tag2', 'tag1'])) // ['tag1', 'tag2']
 */
export function splitTags(
  text: string | string[] | Set<string> | undefined
): string[] {
  if (!text) {
    return []
  }

  let inputText: string
  if (Array.isArray(text)) {
    inputText = text.join(',') // Join array elements with a comma
  } else if (text instanceof Set) {
    inputText = [...text].join(',') // Convert Set to array and join with a comma
  } else {
    inputText = text
  }

  if (!inputText.trim()) {
    return []
  }

  return [
    ...new Set(
      inputText
        .replaceAll(
          /[ \t\f\v\u00A0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]+/g,
          ' '
        ) // Replace whitespace except \r\n with a single space
        .split(/[,，\n\r]+/) // Split by commas (both English and Chinese) and line breaks
        .map((tag) => tag.trim()) // Ensure each tag has no leading or trailing spaces
        .filter(Boolean) // Filter out empty strings
    ),
  ]
}
