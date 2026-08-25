import { getCollection, type CollectionEntry } from 'astro:content';

/**
 * Astro logs "The collection does not exist or is empty" every time `getCollection` is
 * called on a collection with no entries — three times per build while the archive is
 * genuinely empty, which reads like something is broken when nothing is.
 *
 * Vite resolves this glob at build time, so it costs nothing and tells us whether there is
 * anything to ask for before we ask. Delete this shim once there are real past events and
 * call `getCollection` directly if you prefer.
 */
const hasEntries =
  Object.keys(import.meta.glob('/src/content/past-events/*.md', { eager: false })).length > 0;

/** Newest first. */
export async function getPastEvents(): Promise<CollectionEntry<'past-events'>[]> {
  if (!hasEntries) return [];
  const events = await getCollection('past-events');
  return events.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}
