# Not Now Dear — Site Handbook

Everything you need to run, edit and grow the site — written for a non‑developer.
The site is built with [Astro](https://astro.build) (a fast, static site
generator), stored on **GitHub**, and deployed automatically by **Vercel**.

**The golden rule:** you edit text files, push them to GitHub, and Vercel rebuilds
the live site within a minute or two. You never touch a database.

---

## 1. Running the site on your computer (optional)

You only need this if you want to preview changes locally. You can also edit
files directly on GitHub and let Vercel build them.

```bash
npm install      # once, to download the tools
npm run dev      # preview at http://localhost:4321
npm run build    # produce the production site in /dist
npm run preview  # preview the production build
```

You need [Node.js](https://nodejs.org) (version 20 or newer) installed.

---

## 2. Where everything lives

```
Not-Now-Dear/
├─ images/                     ← YOUR ARTWORK lives here (drop new images in)
├─ public/                     ← static files (favicon, robots.txt) served as‑is
│  └─ images/                  ← auto‑generated at build; do not edit by hand
├─ scripts/
│  ├─ prepare-assets.mjs       ← copies /images into /public/images with clean names
│  └─ sync-subscribers.mjs     ← pulls subscribers from Buttondown into subscribers.csv
├─ src/
│  ├─ consts.ts                ← ⭐ SITE SETTINGS: links, email, providers
│  ├─ content/blog/*.md        ← ⭐ YOUR BLOG POSTS (one file per article)
│  ├─ data/
│  │  ├─ retailers.json        ← ⭐ the "Available Worldwide" buy links
│  │  └─ reactions.json        ← ⭐ reader reviews / testimonials
│  ├─ components/              ← reusable building blocks
│  ├─ layouts/                 ← the page shell (head, footer, cookie banner)
│  └─ pages/                   ← the actual pages (home, blog, privacy, 404)
├─ subscribers.csv             ← auto‑updated list of subscribers
└─ .github/workflows/          ← automation (build checks + subscriber sync)
```

The files marked ⭐ are the ones you'll edit day to day.

---

## 3. Writing a blog post

1. In `src/content/blog/`, create a new file ending in `.md`, e.g.
   `my-new-post.md`. **The file name becomes the web address**, so keep it
   lowercase with hyphens: this file becomes `notnowdear.com/blog/my-new-post/`.
2. Paste this template at the top and fill it in:

```markdown
---
title: "Your Headline Here"
date: 2026-08-01
featuredImage: /images/summer-frocks-red.png
featuredImageAlt: "A short description of the image for accessibility"
summary: "One or two sentences shown on cards and in search results."
categories: ["News"]
tags: ["boundaries", "behind-the-book"]
seoTitle: "Optional custom title for Google (falls back to title)"
metaDescription: "Optional custom description for Google (falls back to summary)"
author: "Tristan Coates"
draft: false
---

Write your article here in plain text. Leave a blank line between paragraphs.

## A subheading

- a bullet
- another bullet

> A pull‑quote for emphasis.
```

3. For `featuredImage`, use any image name from the list in section 6, written as
   `/images/the-clean-name.png`.
4. Set `draft: true` to keep a post hidden; set it to `false` to publish.
5. Save, commit and push to GitHub. Vercel rebuilds automatically. Reading time,
   the blog listing, the homepage feed, the sitemap and the RSS feed all update
   on their own.

Every article automatically gets: its own page, SEO tags, Open Graph/Twitter
share cards, structured data for Google, share buttons, and a comments section.

---

## 4. Updating the retailer buy links

Open `src/data/retailers.json`. Each retailer looks like this:

```json
{ "name": "Waterstones", "meta": "In store & online", "url": "", "available": false }
```

When a shop lists the book:

1. Paste the direct link into `"url"`.
2. Change `"available"` to `true`.

That's it — the button turns live. Until then it shows a tasteful "Coming soon".
You can add, remove or reorder retailers and regions freely.

---

## 5. Managing reader reactions

Open `src/data/reactions.json` and add entries:

```json
{ "stars": 5, "quote": "The nicest thing a reader said.", "attribution": "Reader name" }
```

`stars` is 1–5. The current entries are samples — replace them with real reviews
as they arrive.

---

## 6. Adding or changing images

Drop any new image straight into the `images/` folder. At build time,
`prepare-assets.mjs` copies everything into `public/images/` and **renames it to a
clean, web‑safe name** (lowercase, spaces become hyphens). For example:

| You save                          | You reference in a post as         |
|-----------------------------------|------------------------------------|
| `Women on globe 1.png`            | `/images/women-on-globe-1.png`     |
| `Summer Frocks RED.png`           | `/images/summer-frocks-red.png`    |
| `Cover Art.jpg`                   | `/images/cover-art.jpg`            |

Rule of thumb: lowercase the name and replace every space with a hyphen.

**Author portrait:** to add a real photo of Tristan, save it as
`images/author-portrait.jpg`, then follow the comment inside
`src/pages/index.astro` (the "About the author" section) to swap the placeholder
monogram for the photo.

---

## 7. The newsletter (Buttondown)

The signup form collects **name, email, country and a consent tick**, with GDPR
double opt‑in.

**One‑time setup:**

1. Create a free account at <https://buttondown.com>.
2. In Buttondown → Settings, turn on **double opt‑in**.
3. Copy your Buttondown username (this site is set to `not_now_dear`).
4. It's already set in `src/consts.ts` (`buttondownUsername`); change it there if the username ever changes.

Subscribers are stored by Buttondown. You can export them any time from the
Buttondown dashboard (**Subscribers → Export**), and the automation in the next
section also keeps a copy in this repo.

---

## 8. The subscribers.csv file (automatic backup)

`subscribers.csv` holds `Date, Name, Email, Country, Consent`. It updates itself:

1. In Buttondown → Settings → API, copy your **API key**.
2. On GitHub: repo → **Settings → Secrets and variables → Actions → New secret**.
   Name it `BUTTONDOWN_API_KEY` and paste the key.
3. The workflow in `.github/workflows/sync-subscribers.yml` runs every morning
   (and can be run on demand from the **Actions** tab). It writes the latest list
   into `subscribers.csv` and commits it.

Because it's committed to the repo, running `git pull` on your computer brings the
newest `subscribers.csv` straight to your desktop for review and backup.

---

## 9. Comments & reactions (Giscus)

Comments are free, moderated, and backed by GitHub Discussions.

1. Push this repo to GitHub and make it public.
2. Enable **Discussions** in the repo settings.
3. Install the **giscus** app: <https://github.com/apps/giscus>.
4. Go to <https://giscus.app>, enter your repo, and it will generate four values:
   `repo`, `repoId`, `category`, `categoryId`.
5. Paste those into the `COMMENTS` block in `src/consts.ts`.

To moderate, manage the Discussions in your GitHub repo. Until you configure it,
a friendly placeholder appears instead of the comment box.

---

## 10. Analytics & cookies

Analytics is **privacy‑friendly and off until the visitor accepts** the cookie
banner. To enable it, create a free [Plausible](https://plausible.io) account and
set `plausibleDomain` in `src/consts.ts` (e.g. `notnowdear.com`). Leave it blank
to run with no analytics at all. Prefer Google Analytics? See the note in
`src/components/Analytics.astro`.

---

## 11. Deploying (GitHub → Vercel)

This is already how the site works, and nothing changes:

1. Commit and push to GitHub.
2. Vercel detects Astro, runs `npm run build`, and publishes the result.

If you ever reconnect the project in Vercel, use these settings (they're the
defaults): **Framework = Astro**, **Build command = `npm run build`**, **Output
directory = `dist`**. No environment variables are required for the site to build;
`BUTTONDOWN_API_KEY` is only needed by the GitHub subscriber‑sync workflow.

---

## 12. SEO checklist (already built in)

Meta titles/descriptions, canonical URLs, Open Graph + Twitter cards, JSON‑LD
structured data (Website, Book, Person, and BlogPosting per article), an
auto‑generated `sitemap-index.xml`, `robots.txt`, an RSS feed at `/rss.xml`, image
alt text, lazy loading, and accessible markup are all in place. To keep scores
high: always fill in `featuredImageAlt` and `summary` on posts, and keep image
files reasonably sized.

---

## 13. Legacy files you can delete

The old hand‑built site has been replaced by this Astro project. These leftover
files are no longer used and can be safely deleted from the repo whenever you
like: `index.html` (the old root one), the `pages/` folder, the `admin/` folder,
and `public/styles.css` and `public/script.js`. Your artwork in `images/` and the
loose image files at the root are still used — keep those.
