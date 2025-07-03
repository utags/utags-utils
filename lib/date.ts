// eslint-disable-next-line @typescript-eslint/naming-convention
const MIN_VALID_TIMESTAMP = 631_152_000_000 // 1990-01-01
// eslint-disable-next-line @typescript-eslint/naming-convention
const MAX_VALID_TIMESTAMP = 9_999_999_999_999 // 2286-11-20
/**
 * Check if a timestamp is within a valid date range (1990-2286)
 * @param date - The timestamp to validate
 * @returns True if the date is valid, false otherwise
 */
export function isValidDate(date: number | undefined): date is number {
  // 631_152_000_000 is '1990-01-01T00:00:00.000Z'
  // 9_999_999_999_999 is '2286-11-20T17:46:39.999Z'
  // Note: Range comparison already handles NaN and Infinity cases
  return (
    typeof date === 'number' &&
    date > MIN_VALID_TIMESTAMP &&
    date < MAX_VALID_TIMESTAMP
  )
}

/**
 * Normalize the created timestamp by selecting the earliest valid date
 * @param created - The created timestamp
 * @param updated - The updated timestamp
 * @param defaultDate - The fallback date if no valid dates are found
 * @returns The normalized created timestamp
 */
export function normalizeCreated(
  created: number | undefined,
  updated: number | undefined,
  defaultDate: number
): number {
  // Cache validation results to avoid duplicate calls
  const isCreatedValid = isValidDate(created)
  const isUpdatedValid = isValidDate(updated)

  const minValidDate = Math.min(
    isCreatedValid ? created : Infinity,
    isUpdatedValid ? updated : Infinity
  )

  return Number.isFinite(minValidDate) ? minValidDate : defaultDate
}

/**
 * Normalize the updated timestamp by selecting the latest valid date
 * @param created - The created timestamp
 * @param updated - The updated timestamp
 * @param defaultDate - The fallback date if no valid dates are found
 * @returns The normalized updated timestamp
 */
export function normalizeUpdated(
  created: number | undefined,
  updated: number | undefined,
  defaultDate: number
): number {
  // Cache validation results to avoid duplicate calls
  const isCreatedValid = isValidDate(created)
  const isUpdatedValid = isValidDate(updated)

  const maxValidDate = Math.max(
    isCreatedValid ? created : 0,
    isUpdatedValid ? updated : 0
  )

  return maxValidDate || defaultDate
}
