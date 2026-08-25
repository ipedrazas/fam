import type { APIRoute } from 'astro';
import { site } from '../config';
import { getPastEvents } from '../lib/past-events';

const STATIC = ['/', '/events', '/past', '/about', '/code-of-conduct', '/privacy'];

export const GET: APIRoute = async () => {
  const events = await getPastEvents();
  const paths = [
    ...STATIC,
    ...events.filter((e) => e.body?.trim()).map((e) => `/past/${e.id}`),
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map((p) => `  <url><loc>${new URL(p, site.url).href}</loc></url>`).join('\n')}
</urlset>
`;

  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
