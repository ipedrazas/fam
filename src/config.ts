/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  THE ONE FILE YOU EDIT WHEN THE NEXT EVENT GOES UP.
 * ─────────────────────────────────────────────────────────────────────────────
 *  Change `featuredEvent` below, commit, push. That is the whole job.
 *  Everything else here changes roughly never.
 *
 *  See README.md → "Publishing a new event".
 */

export const site = {
  url: 'https://fam.andcake.dev',
  name: 'FAM',
  fullName: 'FAM — Folkestone AI Meetup',
  /** Used as the default meta description and in the footer. */
  tagline:
    'A monthly evening in Folkestone for people interested on AI. No technical knowledge necessary.' +
    'Everybody is welcome: artists, filmmakers, ' +
    'producers, designers, developers, students, and anyone who are curious, sceptical, or somewhere in between about AI.',
  email: 'fam@andcake.dev',
} as const;

export const luma = {
  /**
   * The public calendar page. This is our mailing list — following it on Luma is how
   * people hear about the next one.
   */
  calendarUrl: 'https://luma.com/calendar/cal-aRTnEyjeDM9K2Ck',

  /**
   * PASTE-ONLY. Get this from luma.com/home/calendars → your calendar → Settings → Embed.
   * Luma has moved domains before (lu.ma → luma.com) and the embed shape changes with it.
   * Do not hand-edit or guess this. If /events looks wrong, re-copy it from Luma.
   */
  calendarEmbedUrl: 'https://luma.com/embed/calendar/cal-aRTnEyjeDM9K2Ck/events',
} as const;

/**
 * The next event. `lumaEventId` comes from Manage Event → More → Embed on Luma and looks
 * like `evt-XXXXXXXXXXXX`. Leave it as `null` and the site quietly falls back to linking
 * the calendar instead of showing a checkout button — nothing breaks, nobody sees an error.
 */
export const featuredEvent = {
  /** Which FAM this is. This is the first one. */
  number: 2,
  title: 'Practical AI',
  /** ISO 8601, local time. */
  start: '2026-10-08T18:30:00+01:00',
  doors: '18:30',
  ends: '21:00',
  venue: 'kollectiv',
  venueAddress: '69 The Old High St, Folkestone CT20 1RN',
  cost: 'Free',
  lumaEventUrl: 'https://luma.com/f6298pbr',
  lumaEventId: 'evt-vdvAcm4yeTstmKs',
} as const;

/**
 * What the room is actually like. Getting this wrong is the most harmful mistake this site
 * can make — somebody plans their evening around it and then cannot get in the door — so
 * anything unconfirmed says so in the sentence itself rather than sounding certain.
 */
export const venueAccess = {
  /** Confirmed. */
  stepFree: 'Step-free from the street. Everything happens on the ground floor, so there are no stairs and no lift to worry about.',
  /** Believed, not verified with the venue. The wording says so on purpose. */
  accessibleToilet: 'There should be an accessible toilet.',
  /** Confirmed: there is NO hearing loop. Say so plainly rather than staying quiet. */
  noHearingLoop: 'There is no hearing loop. If that matters to you, email us before you come and we will work something out.',
  /** Confirmed. */
  bar: 'There is a bar and it takes card.',
  /** Confirmed. */
  food: 'There is food.',
  /** Confirmed. */
  station: 'Folkestone Central is the nearest station.',
  /** Confirmed. */
  parking: 'There is parking nearby.',
} as const;

/**
 * Off by default and staying that way unless someone asks for it.
 * No cookies means no cookie banner, which means the ugliest element on the modern web
 * never appears on this site. Flip `enabled` and you take on a GDPR obligation, read
 * /privacy first and update it.
 */
export const analytics = {
  enabled: false,
  provider: 'plausible' as 'plausible' | 'umami',
  domain: 'fam.andcake.dev',
  scriptUrl: 'https://plausible.io/js/script.js',
} as const;

export const nav = [
  { href: '/events', label: 'Events' },
  { href: '/past', label: 'Past' },
  { href: '/about', label: 'About' },
] as const;
