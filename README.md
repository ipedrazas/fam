# FAM, Folkestone AI Meetup

The website for a monthly meetup in Folkestone. Six pages, no database, no backend, no
accounts, no cookies. Everything about the site is a file in this repository.

---

## The two things you will actually do

### 1. Publishing a new event

**Edit one block in one file.**

Open `src/config.ts` and change `featuredEvent`:

```ts
export const featuredEvent = {
  number: 2,
  title: 'The title from Luma',
  start: '2026-10-08T18:30:00+01:00',   // ISO 8601, with the right offset
  doors: '18:30',
  ends: '21:00',
  venue: 'kollectiv',
  venueAddress: 'Folkestone',
  cost: 'Free',
  lumaEventUrl: 'https://luma.com/your-event-slug',
  lumaEventId: 'evt-XXXXXXXXXXXX',
};
```

`lumaEventUrl` and `lumaEventId` come from Luma: **Manage Event → More → Embed**.

Commit, push. The homepage, the events page and every "save me a spot" button on the site
update together.

The `/events` page shows your whole Luma calendar in an embed, so events you add on Luma
appear there without touching this repo at all. `config.ts` only controls the *featured*
event that appears on the homepage.

### 2. Adding a past event

**Drop a markdown file and a folder of photos.** There are none yet, until the first
event happens, `/past` renders a blank contact sheet, which is deliberate. The moment you
add a file here, the page switches to the real archive on its own.

1. Put the photographs in `src/content/past-events/media/<slug>/`, named `01.jpg`, `02.jpg`
   and so on. Six to ten works best on the contact sheet. They will be cropped to 3:2.
2. Create `src/content/past-events/<slug>.md`:

```markdown
---
number: 1
title: Using AI effectively
date: 2026-09-10
venue: kollectiv
blurb: One or two sentences about what actually happened.
attendees: 44          # optional
select: 2              # optional, which photo gets the yellow circle (counts from 0)
speakers:
  - name: A Person
    role: What they do          # optional
    link: https://example.com   # optional
images:
  - src: ./media/<slug>/01.jpg
    alt: A description of what is in this photograph.
  - src: ./media/<slug>/02.jpg
    alt: Another description.
links:                 # optional, slides, recordings, things people made
  - label: Slides
    url: https://example.com/slides
---

Anything you write down here becomes a full write-up page at `/past/<slug>`, linked from
the contact sheet. Leave it empty and the event just lives on the archive page, which is
fine, most of them will.
```

3. `npm run build`. Commit, push.

**Alt text is not optional.** If you add a photograph without describing it, the build
fails with a message telling you which one. That is deliberate: a contact sheet with no alt
text is a page full of nothing for anyone on a screen reader or a bad connection.

The filename is the URL. `2026-10-08-the-title.md` becomes `/past/2026-10-08-the-title`.
Once you have pushed it, do not rename it, people will have shared the link.

---

## Running it

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # type-check, validate content, build to dist/
npm run preview  # serve the built site
```

Node 22 or newer.

| Script | What it does |
|---|---|
| `npm run build` | Runs `astro check` then `astro build`. Fails on missing alt text, bad frontmatter, or a type error. |
| `npm run og` | Regenerates the social share cards in `public/og/`. Run after changing their text in `scripts/make-og.mjs`. Output is committed. |
| `./scripts/check-links.sh` | Checks every internal link in `dist/` resolves. CI runs this. |

## Deploying

The site is a folder of static files, so it will go anywhere.

**Cloudflare Pages / Netlify**, connect the repo, build command `npm run build`, output
directory `dist`. Nothing else to configure.

**Your own VM**, which is what the Docker setup here is for:

```bash
docker compose pull
docker compose up -d
```

That runs `ghcr.io/ipedrazas/fam:latest` behind nginx on port 8080. Put Caddy, Traefik or
host nginx in front of it for TLS. The container is read-only, drops privileges, and holds
no state.

Pushing to `main` builds and publishes the image via
`.github/workflows/publish.yml`. To have that also restart the container on the VM, set the
repository variable `DEPLOY_ENABLED` to `true` and add the secrets `DEPLOY_HOST`,
`DEPLOY_USER` and `DEPLOY_SSH_KEY` (plus optionally the variable `DEPLOY_PATH`, which
defaults to `/srv/fam`).

## What is where

```
src/
  config.ts               ← the file you edit for a new event
  content.config.ts       the past-event schema, including the alt-text rule
  content/past-events/    one markdown file per event, photos under media/ (empty for now)
  components/             LumaCalendar and LumaRegisterButton are paste-only, read them
  layouts/Base.astro      head, fonts, header, footer, the single Luma script tag
  pages/                  one file per route
  styles/                 tokens.css → base.css → components.css
public/
  og/                     social share cards (committed, regenerate with npm run og)
  hero/HERO-PHOTO.md      how to add a real photograph to the homepage
CODE_OF_CONDUCT.md        the source for /code-of-conduct, edit here, the page follows
```

## Some deliberate choices

- **No cookies, no analytics, no tracking, no cookie banner.** If you ever want visitor
  numbers, `analytics` in `src/config.ts` will wire up Plausible or Umami behind one flag.
  It is off, and turning it on means updating `/privacy` first, the page says so.
- **No CMS.** Adding a past event is writing a file and pushing it. That is the feature.
- **No dark-mode toggle.** One mode, executed properly.
- **One piece of third-party JavaScript**, the Luma checkout button, loaded once with
  `defer`. Every embed on the site has a plain link next to it that works without it.
- **Fonts are self-hosted.** Nothing is fetched from Google or any CDN at page load.

## Fonts

Three, all OFL, all self-hosted from npm:

- **Redaction 20**, display. A serif built around the degradation of a reproduced image.
- **Public Sans**, body. Commissioned to make official information readable by everyone.
- **Courier Prime**, dates, venues, captions. The font screenplays are written in.

## Licence

Code: MIT, see `LICENSE`. The photographs and written content are not, they belong to FAM
and the people in them.
