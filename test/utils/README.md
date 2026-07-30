# Utilities Unit Tests (test/utils/)

Jest test suites for date utility functions.

## Tests

6 tests covering:

- **parseDateValue** -- Parses various date string formats into Date objects. Handles ISO strings, SQL date formats, and edge cases.
- **formatDateKey** -- Formats Date objects into standardized key strings (YYYY-MM-DD).
- **getDatesBetween** -- Generates arrays of Date objects between two boundaries. Validates inclusive boundaries and leap year transitions.
- **getISOWeekNumber** -- Computes ISO 8601 week numbers from Date objects.
- **getDaysInMonth** -- Returns correct day counts per month. Validates February in leap and non-leap years.
- **formatDateRangeBadge** -- Formats selection summaries for the badge display (single day, range, multiple ranges).

All functions are timezone-agnostic pure functions tested with deterministic inputs.
