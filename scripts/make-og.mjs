/**
 * Builds the Open Graph cards in public/og/.
 *
 *   npm run og
 *
 * These get pasted into WhatsApp and Instagram, which for this meetup matters more than
 * search does — so they are designed, not generated on the fly. The output is committed;
 * nothing at build time or deploy time depends on this script.
 *
 * It renders with the real site faces. Fontconfig can't read woff2, so the two faces we
 * need are decompressed to ttf into node_modules/.cache first and fontconfig is pointed
 * at that directory only — which also makes the render deterministic.
 */
import { writeFile, mkdir } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { decompress } from 'wawoff2';

const CACHE = resolve('node_modules/.cache/fam-fonts');
const OUT = resolve('public/og');

const FACES = {
  'redaction.ttf': 'node_modules/@fontsource/redaction-20/files/redaction-20-latin-400-normal.woff2',
  'courier.ttf': 'node_modules/@fontsource/courier-prime/files/courier-prime-latin-400-normal.woff2',
  'courier-bold.ttf': 'node_modules/@fontsource/courier-prime/files/courier-prime-latin-700-normal.woff2',
};

await mkdir(CACHE, { recursive: true });
await mkdir(`${CACHE}/cache`, { recursive: true });
await mkdir(OUT, { recursive: true });

for (const [out, src] of Object.entries(FACES)) {
  await writeFile(`${CACHE}/${out}`, Buffer.from(await decompress(readFileSync(src))));
}

const conf = `<?xml version="1.0"?>
<!DOCTYPE fontconfig SYSTEM "fonts.dtd">
<fontconfig>
  <dir>${CACHE}</dir>
  <cachedir>${CACHE}/cache</cachedir>
</fontconfig>`;
await writeFile(`${CACHE}/fonts.conf`, conf);

// Must be set before libvips initialises fontconfig, hence the dynamic import below.
process.env.FONTCONFIG_FILE = `${CACHE}/fonts.conf`;
process.env.FONTCONFIG_PATH = CACHE;
const sharp = (await import('sharp')).default;

const W = 1200;
const H = 630;
const REBATE = '#101109';
const SHEET = '#efefe9';
const EDGE = '#a8a89c';
const SELECT = '#eba91f';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Redaction runs about 0.50em average across mixed case at these sizes. */
function wrap(text, size, maxWidth) {
  const per = size * 0.5;
  const max = Math.floor(maxWidth / per);
  const lines = [];
  let line = '';
  for (const word of text.split(' ')) {
    const next = line ? `${line} ${word}` : word;
    if (next.length > max && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function card({ title, kicker }) {
  const PAD = 76;
  const maxWidth = W - PAD * 2 - 40;
  let size = 88;
  let lines = wrap(title, size, maxWidth);
  while (lines.length > 3 && size > 52) {
    size -= 6;
    lines = wrap(title, size, maxWidth);
  }
  const lh = size * 1.06;
  const blockTop = 300 - ((lines.length - 1) * lh) / 2;

  // 35mm edge codes along the bottom rebate — the same numbering the contact sheet uses.
  const codes = ['34', '34A', '35', '35A', '36', '36A']
    .map((c, i) => `<text x="${PAD + i * 96}" y="${H - 40}" font-family="Courier Prime" font-size="20" letter-spacing="3" fill="#63645a">${c}</text>`)
    .join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="${REBATE}"/>

  <g transform="translate(${PAD} 84)">
    <text x="0" y="0" font-family="Redaction 20" font-size="54" fill="${SHEET}">FAM</text>
    <g transform="translate(-26 -50) rotate(-3 78 34)">
      <path d="M8,36 C7,18 33,8 53,7 C75,6 94,15 94,33 C94,51 73,61 51,61 C29,61 10,54 8,37 C7,29 12,20 22,13"
            fill="none" stroke="${SELECT}" stroke-width="3.5" stroke-linecap="round" opacity="0.95"/>
    </g>
  </g>

  <g font-family="Redaction 20" font-size="${size}" fill="${SHEET}">
    ${lines.map((l, i) => `<text x="${PAD}" y="${(blockTop + i * lh).toFixed(1)}">${esc(l)}</text>`).join('\n    ')}
  </g>

  <text x="${PAD}" y="${H - 108}" font-family="Courier Prime" font-size="26" letter-spacing="3.4" fill="${EDGE}">${esc(kicker.toUpperCase())}</text>

  <rect x="${PAD}" y="${H - 86}" width="${W - PAD * 2}" height="2" fill="${SELECT}" opacity="0.85"/>
  ${codes}
</svg>`;
}

const CARDS = [
  {
    file: 'fam-og.png',
    title: 'You do not need to be technical. You need to be curious.',
    kicker: 'Folkestone AI Meetup · Monthly, in Folkestone',
  },
  {
    file: 'events.png',
    title: 'The next one, and the ones after that.',
    kicker: 'Upcoming events · Free · Folkestone',
  },
  {
    file: 'past.png',
    title: 'This is where the photographs go.',
    kicker: 'The archive · Photographs, talks, things people made',
  },
  {
    file: 'about.png',
    title: 'What this is, and whether you are welcome. You are.',
    kicker: 'About FAM · Folkestone AI Meetup',
  },
];

for (const c of CARDS) {
  await sharp(Buffer.from(card(c)))
    .png({ compressionLevel: 9, palette: true })
    .toFile(`${OUT}/${c.file}`);
  console.log(`og/${c.file}`);
}
