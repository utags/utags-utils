import { isValidDate, normalizeCreated, normalizeUpdated } from './date.js'

/* eslint-disable @typescript-eslint/naming-convention */
// Test constants
const MIN_VALID_TIMESTAMP = 631_152_000_000 // 1990-01-01
const MAX_VALID_TIMESTAMP = 9_999_999_999_999 // 2286-11-20
const VALID_DATE_1990 = 631_152_000_000 // 1990-01-01T00:00:00.000Z
const VALID_DATE_2000 = 946_684_800_000 // 2000-01-01T00:00:00.000Z
const VALID_DATE_2020 = 1_577_836_800_000 // 2020-01-01T00:00:00.000Z
const VALID_DATE_2023 = 1_672_531_200_000 // 2023-01-01T00:00:00.000Z
const VALID_DATE_2286 = 9_999_999_999_999 // 2286-11-20T17:46:39.999Z
const INVALID_DATE_TOO_OLD = 0 // 1970-01-01T00:00:00.000Z
const INVALID_DATE_TOO_NEW = 10_000_000_000_000 // Beyond 2286
const DEFAULT_DATE = 1_640_995_200_000 // 2022-01-01T00:00:00.000Z
/* eslint-enable @typescript-eslint/naming-convention */

describe('isValidDate', () => {
  describe('Valid cases', () => {
    it('should return true for valid timestamps within range', () => {
      expect(isValidDate(VALID_DATE_1990 + 1)).toBe(true)
      expect(isValidDate(VALID_DATE_2000)).toBe(true)
      expect(isValidDate(VALID_DATE_2020)).toBe(true)
      expect(isValidDate(VALID_DATE_2023)).toBe(true)
      expect(isValidDate(VALID_DATE_2286 - 1)).toBe(true)
    })

    it('should return true for edge cases within valid range', () => {
      expect(isValidDate(MIN_VALID_TIMESTAMP + 1)).toBe(true)
      expect(isValidDate(MAX_VALID_TIMESTAMP - 1)).toBe(true)
    })
  })

  describe('Invalid cases - boundary values', () => {
    it('should return false for timestamps at exact boundaries', () => {
      expect(isValidDate(MIN_VALID_TIMESTAMP)).toBe(false)
      expect(isValidDate(MAX_VALID_TIMESTAMP)).toBe(false)
    })

    it('should return false for timestamps outside valid range', () => {
      expect(isValidDate(INVALID_DATE_TOO_OLD)).toBe(false)
      expect(isValidDate(INVALID_DATE_TOO_NEW)).toBe(false)
      expect(isValidDate(MIN_VALID_TIMESTAMP - 1)).toBe(false)
      expect(isValidDate(MAX_VALID_TIMESTAMP + 1)).toBe(false)
    })
  })

  describe('Invalid cases - special numeric values', () => {
    it('should return false for NaN', () => {
      expect(isValidDate(Number.NaN)).toBe(false)
    })

    it('should return false for Infinity', () => {
      expect(isValidDate(Infinity)).toBe(false)
      expect(isValidDate(-Infinity)).toBe(false)
    })

    it('should return false for negative numbers', () => {
      expect(isValidDate(-1)).toBe(false)
      expect(isValidDate(-1000)).toBe(false)
    })

    it('should return false for zero', () => {
      expect(isValidDate(0)).toBe(false)
    })
  })

  describe('Invalid cases - non-numeric types', () => {
    it('should return false for undefined', () => {
      expect(isValidDate(undefined)).toBe(false)
    })

    /* eslint-disable @typescript-eslint/no-unsafe-argument */
    it('should return false for null', () => {
      expect(isValidDate(null as any)).toBe(false)
    })

    it('should return false for string numbers', () => {
      expect(isValidDate('1640995200000' as any)).toBe(false)
      expect(isValidDate('0' as any)).toBe(false)
    })

    it('should return false for boolean values', () => {
      expect(isValidDate(true as any)).toBe(false)
      expect(isValidDate(false as any)).toBe(false)
    })

    it('should return false for objects', () => {
      expect(isValidDate({} as any)).toBe(false)
      expect(isValidDate([] as any)).toBe(false)
      expect(isValidDate(new Date() as any)).toBe(false)
    })
    /* eslint-enable @typescript-eslint/no-unsafe-argument */
  })
})

describe('normalizeCreated', () => {
  describe('Both dates valid', () => {
    it('should return the earlier date when both are valid', () => {
      expect(
        normalizeCreated(VALID_DATE_2023, VALID_DATE_2020, DEFAULT_DATE)
      ).toBe(VALID_DATE_2020)
      expect(
        normalizeCreated(VALID_DATE_2020, VALID_DATE_2023, DEFAULT_DATE)
      ).toBe(VALID_DATE_2020)
    })

    it('should return the same date when both are identical', () => {
      expect(
        normalizeCreated(VALID_DATE_2020, VALID_DATE_2020, DEFAULT_DATE)
      ).toBe(VALID_DATE_2020)
    })

    it('should work with edge case valid dates', () => {
      const earlyDate = MIN_VALID_TIMESTAMP + 1
      const lateDate = MAX_VALID_TIMESTAMP - 1
      expect(normalizeCreated(lateDate, earlyDate, DEFAULT_DATE)).toBe(
        earlyDate
      )
    })
  })

  describe('One date valid', () => {
    it('should return valid created date when updated is invalid', () => {
      expect(normalizeCreated(VALID_DATE_2020, undefined, DEFAULT_DATE)).toBe(
        VALID_DATE_2020
      )
      expect(normalizeCreated(VALID_DATE_2020, Number.NaN, DEFAULT_DATE)).toBe(
        VALID_DATE_2020
      )
      expect(
        normalizeCreated(VALID_DATE_2020, INVALID_DATE_TOO_OLD, DEFAULT_DATE)
      ).toBe(VALID_DATE_2020)
    })

    it('should return valid updated date when created is invalid', () => {
      expect(normalizeCreated(undefined, VALID_DATE_2020, DEFAULT_DATE)).toBe(
        VALID_DATE_2020
      )
      expect(normalizeCreated(Number.NaN, VALID_DATE_2020, DEFAULT_DATE)).toBe(
        VALID_DATE_2020
      )
      expect(
        normalizeCreated(INVALID_DATE_TOO_NEW, VALID_DATE_2020, DEFAULT_DATE)
      ).toBe(VALID_DATE_2020)
    })
  })

  describe('Both dates invalid', () => {
    it('should return default date when both are undefined', () => {
      expect(normalizeCreated(undefined, undefined, DEFAULT_DATE)).toBe(
        DEFAULT_DATE
      )
    })

    it('should return default date when both are NaN', () => {
      expect(normalizeCreated(Number.NaN, Number.NaN, DEFAULT_DATE)).toBe(
        DEFAULT_DATE
      )
    })

    it('should return default date when both are Infinity', () => {
      expect(normalizeCreated(Infinity, Infinity, DEFAULT_DATE)).toBe(
        DEFAULT_DATE
      )
      expect(normalizeCreated(-Infinity, -Infinity, DEFAULT_DATE)).toBe(
        DEFAULT_DATE
      )
    })

    it('should return default date when both are out of range', () => {
      expect(
        normalizeCreated(
          INVALID_DATE_TOO_OLD,
          INVALID_DATE_TOO_NEW,
          DEFAULT_DATE
        )
      ).toBe(DEFAULT_DATE)
    })

    it('should return default date for mixed invalid values', () => {
      expect(normalizeCreated(undefined, Number.NaN, DEFAULT_DATE)).toBe(
        DEFAULT_DATE
      )
      expect(
        normalizeCreated(Infinity, INVALID_DATE_TOO_OLD, DEFAULT_DATE)
      ).toBe(DEFAULT_DATE)
    })
  })

  describe('Edge cases with default date', () => {
    it('should work when default date is different from valid dates', () => {
      const customDefault = VALID_DATE_2000
      expect(normalizeCreated(undefined, undefined, customDefault)).toBe(
        customDefault
      )
      expect(normalizeCreated(VALID_DATE_2020, undefined, customDefault)).toBe(
        VALID_DATE_2020
      )
    })

    it('should handle when valid date is earlier than default', () => {
      const laterDefault = VALID_DATE_2023
      expect(normalizeCreated(VALID_DATE_2000, undefined, laterDefault)).toBe(
        VALID_DATE_2000
      )
    })
  })
})

describe('normalizeUpdated', () => {
  describe('Both dates valid', () => {
    it('should return the later date when both are valid', () => {
      expect(
        normalizeUpdated(VALID_DATE_2020, VALID_DATE_2023, DEFAULT_DATE)
      ).toBe(VALID_DATE_2023)
      expect(
        normalizeUpdated(VALID_DATE_2023, VALID_DATE_2020, DEFAULT_DATE)
      ).toBe(VALID_DATE_2023)
    })

    it('should return the same date when both are identical', () => {
      expect(
        normalizeUpdated(VALID_DATE_2020, VALID_DATE_2020, DEFAULT_DATE)
      ).toBe(VALID_DATE_2020)
    })

    it('should work with edge case valid dates', () => {
      const earlyDate = MIN_VALID_TIMESTAMP + 1
      const lateDate = MAX_VALID_TIMESTAMP - 1
      expect(normalizeUpdated(earlyDate, lateDate, DEFAULT_DATE)).toBe(lateDate)
    })
  })

  describe('One date valid', () => {
    it('should return valid created date when updated is invalid', () => {
      expect(normalizeUpdated(VALID_DATE_2020, undefined, DEFAULT_DATE)).toBe(
        VALID_DATE_2020
      )
      expect(normalizeUpdated(VALID_DATE_2020, Number.NaN, DEFAULT_DATE)).toBe(
        VALID_DATE_2020
      )
      expect(
        normalizeUpdated(VALID_DATE_2020, INVALID_DATE_TOO_OLD, DEFAULT_DATE)
      ).toBe(VALID_DATE_2020)
    })

    it('should return valid updated date when created is invalid', () => {
      expect(normalizeUpdated(undefined, VALID_DATE_2020, DEFAULT_DATE)).toBe(
        VALID_DATE_2020
      )
      expect(normalizeUpdated(Number.NaN, VALID_DATE_2020, DEFAULT_DATE)).toBe(
        VALID_DATE_2020
      )
      expect(
        normalizeUpdated(INVALID_DATE_TOO_NEW, VALID_DATE_2020, DEFAULT_DATE)
      ).toBe(VALID_DATE_2020)
    })
  })

  describe('Both dates invalid', () => {
    it('should return default date when both are undefined', () => {
      expect(normalizeUpdated(undefined, undefined, DEFAULT_DATE)).toBe(
        DEFAULT_DATE
      )
    })

    it('should return default date when both are NaN', () => {
      expect(normalizeUpdated(Number.NaN, Number.NaN, DEFAULT_DATE)).toBe(
        DEFAULT_DATE
      )
    })

    it('should return default date when both are zero', () => {
      expect(normalizeUpdated(0, 0, DEFAULT_DATE)).toBe(DEFAULT_DATE)
    })

    it('should return default date when both are out of range', () => {
      expect(
        normalizeUpdated(
          INVALID_DATE_TOO_OLD,
          INVALID_DATE_TOO_NEW,
          DEFAULT_DATE
        )
      ).toBe(DEFAULT_DATE)
    })

    it('should return default date for mixed invalid values', () => {
      expect(normalizeUpdated(undefined, Number.NaN, DEFAULT_DATE)).toBe(
        DEFAULT_DATE
      )
      expect(normalizeUpdated(0, INVALID_DATE_TOO_OLD, DEFAULT_DATE)).toBe(
        DEFAULT_DATE
      )
    })
  })

  describe('Edge cases with default date', () => {
    it('should work when default date is different from valid dates', () => {
      const customDefault = VALID_DATE_2000
      expect(normalizeUpdated(undefined, undefined, customDefault)).toBe(
        customDefault
      )
      expect(normalizeUpdated(VALID_DATE_2020, undefined, customDefault)).toBe(
        VALID_DATE_2020
      )
    })

    it('should handle when valid date is later than default', () => {
      const earlierDefault = VALID_DATE_2000
      expect(normalizeUpdated(VALID_DATE_2023, undefined, earlierDefault)).toBe(
        VALID_DATE_2023
      )
    })
  })

  describe('Special behavior differences from normalizeCreated', () => {
    it('should use 0 as fallback for invalid dates in Math.max', () => {
      // This tests the internal logic where invalid dates become 0 in Math.max
      expect(normalizeUpdated(undefined, undefined, DEFAULT_DATE)).toBe(
        DEFAULT_DATE
      )
    })

    it('should handle the || defaultDate fallback correctly', () => {
      // When Math.max returns 0 (falsy), it should fallback to defaultDate
      expect(
        normalizeUpdated(
          INVALID_DATE_TOO_OLD,
          INVALID_DATE_TOO_NEW,
          DEFAULT_DATE
        )
      ).toBe(DEFAULT_DATE)
    })
  })
})

describe('Integration tests', () => {
  describe('normalizeCreated and normalizeUpdated consistency', () => {
    it('should ensure created <= updated when both functions are used', () => {
      const created = VALID_DATE_2023
      const updated = VALID_DATE_2020
      const defaultDate = DEFAULT_DATE

      const normalizedCreated = normalizeCreated(created, updated, defaultDate)
      const normalizedUpdated = normalizeUpdated(created, updated, defaultDate)

      expect(normalizedCreated).toBeLessThanOrEqual(normalizedUpdated)
    })

    it('should handle mixed valid/invalid scenarios consistently', () => {
      const scenarios = [
        { created: VALID_DATE_2020, updated: undefined },
        { created: undefined, updated: VALID_DATE_2020 },
        { created: undefined, updated: undefined },
        { created: Number.NaN, updated: VALID_DATE_2020 },
        { created: VALID_DATE_2020, updated: Number.NaN },
      ]

      for (const { created, updated } of scenarios) {
        const normalizedCreated = normalizeCreated(
          created,
          updated,
          DEFAULT_DATE
        )
        const normalizedUpdated = normalizeUpdated(
          created,
          updated,
          DEFAULT_DATE
        )
        expect(normalizedCreated).toBeLessThanOrEqual(normalizedUpdated)
      }
    })
  })

  describe('Performance considerations', () => {
    it('should handle large numbers of calls efficiently', () => {
      const iterations = 1000
      const start = performance.now()

      for (let i = 0; i < iterations; i++) {
        isValidDate(VALID_DATE_2020 + i)
        normalizeCreated(VALID_DATE_2020, VALID_DATE_2023, DEFAULT_DATE)
        normalizeUpdated(VALID_DATE_2020, VALID_DATE_2023, DEFAULT_DATE)
      }

      const end = performance.now()
      const duration = end - start

      // Should complete within reasonable time (adjust threshold as needed)
      expect(duration).toBeLessThan(100) // 100ms for 1000 iterations
    })
  })
})
