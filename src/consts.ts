// ---------------------------------------------------------------------------
// Central site configuration. Non-technical edits (links, handles, providers)
// can all be made here. See DOCUMENTATION.md for a plain-English walkthrough.
// ---------------------------------------------------------------------------
export const SITE = {
  title: 'Not Now Dear',
  tagline: "I'm Gathering My Thoughts",
  fullTitle: "Not Now Dear... I'm Gathering My Thoughts",
  description:
    "Not Now Dear... I'm Gathering My Thoughts — a warm, witty and quietly provocative novel by Tristan Coates about the people we love, the boundaries we draw, and the life that begins when we finally make room for ourselves.",
  url: 'https://www.notnowdear.com',
  author: 'Tristan Coates',
  publisher: 'Austin Macauley Publishers',
  email: 'notnowdearIGMT@gmail.com',
  locale: 'en_GB',
  // ISBN-13 (derived from the Amazon ASIN / ISBN-10 1398483303). Verify with the publisher.
  isbn: '9781398483309',
};

export const SOCIAL = {
  instagram: 'https://www.instagram.com/notnowdearigmt/',
};

// Primary "Buy the book" link (Amazon US). Add more retailers here later if needed.
export const BUY = {
  amazon: 'https://www.amazon.com/Not-Now-Dear-Tristan-Coates/dp/1398483303',
};

// Newsletter (Buttondown). Create a free account at https://buttondown.com,
// turn on "double opt-in" in Settings, then paste your username below.
export const NEWSLETTER = {
  provider: 'buttondown',
  buttondownUsername: 'not_now_dear',
};

// Comments + reactions (Giscus, backed by GitHub Discussions — free, moderated).
// Set up at https://giscus.app, then paste the values it generates here.
export const COMMENTS = {
  enabled: true,
  repo: 'NotNowDear/Not-Now-Dear',
  repoId: 'R_kgDOTedFvA',
  category: 'Announcements',
  categoryId: 'DIC_kwDOTedFvM4DB5aQ',
};

// Privacy-friendly analytics (Plausible). Loaded only AFTER cookie consent.
// Leave domain empty to disable analytics entirely.
export const ANALYTICS = {
  provider: 'plausible',
  plausibleDomain: '', // e.g. 'notnowdear.com'
};
