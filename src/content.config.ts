import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

/**
 * Past events. One markdown file per event in src/content/past-events/.
 * Photos live in src/content/past-events/media/<slug>/ so Astro can optimise them.
 *
 * Alt text is required, not optional. If you add a photo without describing it,
 * `npm run build` fails. That is deliberate — half the people who read this site
 * will be on a phone with images off or a screen reader on, and a contact sheet
 * with no alt text is a page full of nothing.
 */
const pastEvents = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/past-events' }),
  schema: ({ image }) =>
    z.object({
      /** FAM 01, FAM 02… shown in the sheet header. */
      number: z.number().int().positive(),
      title: z.string().min(1),
      date: z.coerce.date(),
      venue: z.string().min(1),
      /** One or two sentences. What actually happened. */
      blurb: z.string().min(1),
      speakers: z
        .array(
          z.object({
            name: z.string().min(1),
            role: z.string().optional(),
            link: z.url().optional(),
          }),
        )
        .default([]),
      images: z
        .array(
          z.object({
            src: image(),
            alt: z
              .string({ error: 'Every photo needs alt text. No exceptions.' })
              .min(1, 'Alt text cannot be empty. Describe what is in the photo.'),
          }),
        )
        .min(1, 'A past event needs at least one photo, it is the whole point of the page.'),
      /** Slides, recordings, things people made afterwards. */
      links: z
        .array(z.object({ label: z.string().min(1), url: z.url() }))
        .default([]),
      attendees: z.number().int().positive().optional(),
      /**
       * Which frame gets the chinagraph circle — the picture editor's "this one".
       * Zero-indexed. Defaults to the first frame.
       */
      select: z.number().int().nonnegative().default(0),
    }),
});

export const collections = { 'past-events': pastEvents };
