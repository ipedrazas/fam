const TZ = 'Europe/London';

function fmt(d: Date, opts: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat('en-GB', { timeZone: TZ, ...opts }).format(d);
}

/** THU 27 AUG 2026 — call-sheet form, for mono settings. */
export function slate(d: Date) {
  return fmt(d, { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })
    .replace(/,/g, '')
    .toUpperCase();
}

/** Thursday 27 August 2026 — prose form. */
export function longDate(d: Date) {
  return fmt(d, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

/** 19:00 */
export function time(d: Date) {
  return fmt(d, { hour: '2-digit', minute: '2-digit', hour12: false });
}

/** For <time datetime="…"> */
export function iso(d: Date) {
  return d.toISOString();
}

/** 2026-08-27 — date-only machine form. */
export function isoDate(d: Date) {
  return fmt(d, { year: 'numeric', month: '2-digit', day: '2-digit' })
    .split('/')
    .reverse()
    .join('-');
}
