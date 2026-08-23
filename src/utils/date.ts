// `new Date('2026-08-30')` parses a date-only ISO string as UTC midnight, so
// any visitor west of UTC (all of the US) sees it roll back a day once
// `.toLocaleDateString()`/`.getDate()` render it in local time — e.g. a
// Sunday event displaying as "Saturday, August 29" instead of "Sunday,
// August 30". Building the Date from its Y/M/D parts instead constructs it
// in the visitor's local timezone directly, sidestepping the UTC round-trip.
// Use this (not `new Date(dateStr)`) for every plain "YYYY-MM-DD" field —
// Event.date, Album.eventDate — wherever it's parsed for display.
export function parseLocalDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}
