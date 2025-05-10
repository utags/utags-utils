/**
 * Trims and normalizes whitespace in a string
 * @param title - The input string to be processed, can be undefined
 * @returns A string with normalized whitespace or empty string if input is undefined
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export function trimTitle(title: string | undefined | null): string {
  if (!title) return ''
  return title.replaceAll(/\s+/gm, ' ').trim()
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
 * Splits text string into an array of unique tags
 * @param text - Input tag text, can be undefined
 * @returns Array of unique processed tags
 *
 * Processing rules:
 * 1. Normalizes all whitespace (replaces consecutive spaces, tabs with a single space)
 * 2. Splits by delimiters (English/Chinese commas, line breaks)
 * 3. Trims leading and trailing spaces from each tag
 * 4. Filters out empty tags
 * 5. Removes duplicates
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
 */
export function splitTags(text: string | undefined) {
  if (!text) {
    return []
  }

  return [
    ...new Set(
      text
        .replaceAll(
          /[\f\t\v \u00A0\u1680\u180E\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]+/g,
          ' '
        ) // Replace all whitespace characters with a single space
        .split(/[,，\n\r]+/) // Split by commas (both English and Chinese) and line breaks
        .map((tag) => tag.trim()) // Ensure each tag has no leading or trailing spaces
        .filter(Boolean) // Filter out empty strings
    ),
  ]
}
