// Copies the author's artwork into /public/images with clean, SEO-friendly,
// URL-safe filenames (e.g. /images/women-on-globe-1.png) and, where possible,
// generates an optimised .webp alongside each raster image for fast loading.
// Runs automatically before dev and every build (see package.json scripts).
import { promises as fs } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const OUT = path.join(ROOT, 'public', 'images');
const IMAGE_EXT = new Set(['.png', '.jpg', '.jpeg', '.webp', '.avif', '.gif', '.svg']);
const RASTER_EXT = new Set(['.png', '.jpg', '.jpeg']);
const MAX_WIDTH = 2400; // downscale anything wider than this
const WEBP_QUALITY = 80;

function slugify(file) {
  const ext = path.extname(file).toLowerCase();
  const base = path.basename(file, path.extname(file));
  const slug = base
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return `${slug}${ext === '.jpeg' ? '.jpg' : ext}`;
}

async function collect(dir) {
  const out = [];
  let entries = [];
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const e of entries) {
    if (e.isFile() && IMAGE_EXT.has(path.extname(e.name).toLowerCase())) {
      out.push(path.join(dir, e.name));
    }
  }
  return out;
}

// Try to load sharp (bundled with Astro). If unavailable, we simply skip WebP.
async function loadSharp() {
  try {
    return (await import('sharp')).default;
  } catch {
    console.warn('[prepare-assets] sharp not available — skipping WebP generation.');
    return null;
  }
}

export async function prepareAssets() {
  await fs.mkdir(OUT, { recursive: true });
  const sharp = await loadSharp();

  // Source folders: /images plus a few loose images at the repo root.
  const sources = [
    ...(await collect(path.join(ROOT, 'images'))),
    ...(await collect(ROOT)),
  ];

  let copied = 0;
  let webp = 0;
  const seen = new Set();

  for (const src of sources) {
    const destName = slugify(src);
    if (seen.has(destName)) continue; // first source wins on name collision
    seen.add(destName);

    const dest = path.join(OUT, destName);
    await fs.copyFile(src, dest);
    copied++;

    const ext = path.extname(src).toLowerCase();
    if (sharp && RASTER_EXT.has(ext)) {
      const webpDest = path.join(OUT, destName.replace(/\.(png|jpe?g)$/i, '.webp'));
      try {
        const img = sharp(src);
        const meta = await img.metadata();
        const pipeline = meta.width && meta.width > MAX_WIDTH
          ? img.resize({ width: MAX_WIDTH, withoutEnlargement: true })
          : img;
        await pipeline.webp({ quality: WEBP_QUALITY }).toFile(webpDest);
        webp++;
      } catch (err) {
        console.warn(`[prepare-assets] could not convert ${destName}:`, err.message);
      }
    }
  }

  console.log(`[prepare-assets] copied ${copied} images, generated ${webp} WebP -> public/images/`);
}

// Run directly from the command line (e.g. `node scripts/prepare-assets.mjs`).
const invokedDirectly =
  process.argv[1] && import.meta.url === `file://${process.argv[1]}`;
if (invokedDirectly) {
  prepareAssets().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
