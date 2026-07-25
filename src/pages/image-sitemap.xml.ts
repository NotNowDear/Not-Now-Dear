import { getCollection } from 'astro:content';
import { SITE } from '../consts';

// A Google image sitemap: lists the key images on each page so Google Images
// can discover and index them. Referenced from robots.txt.
export async function GET() {
  const abs = (p: string) => new URL(p, SITE.url).href;
  const esc = (s: string) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const posts = (await getCollection('blog'))
    .filter((p) => !p.data.draft)
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  const homeImages = [
    '/images/hero.png',
    '/images/updated-cover.png',
    '/images/final-artwork-austin-macauley.jpg',
    '/images/insta-qr-code.png',
  ];

  const urls = [
    { loc: '/', images: homeImages },
    ...posts.map((p) => {
      const imgs = [p.data.featuredImage];
      if (p.data.ogImage && p.data.ogImage !== p.data.featuredImage) {
        imgs.push(p.data.ogImage);
      }
      return { loc: `/blog/${p.id}/`, images: imgs };
    }),
  ];

  const body = urls
    .map(
      (u) => `  <url>
    <loc>${esc(abs(u.loc))}</loc>
${u.images.map((img) => `    <image:image><image:loc>${esc(abs(img))}</image:loc></image:image>`).join('\n')}
  </url>`
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${body}
</urlset>
`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
