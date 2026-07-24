// Pulls the current subscriber list from Buttondown and writes subscribers.csv.
// Runs in CI (see .github/workflows/sync-subscribers.yml) and can be run locally:
//   BUTTONDOWN_API_KEY=xxxxx node scripts/sync-subscribers.mjs
//
// Output columns: Date, Name, Email, Country, Consent
import { promises as fs } from 'node:fs';
import path from 'node:path';

const API_KEY = process.env.BUTTONDOWN_API_KEY;
const OUT = path.join(process.cwd(), 'subscribers.csv');

if (!API_KEY) {
  console.error('Missing BUTTONDOWN_API_KEY environment variable.');
  process.exit(1);
}

function csvCell(value) {
  const s = String(value ?? '');
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

async function fetchAll() {
  const subscribers = [];
  let url = 'https://api.buttondown.com/v1/subscribers?ordering=creation_date';
  while (url) {
    const res = await fetch(url, {
      headers: { Authorization: `Token ${API_KEY}` },
    });
    if (!res.ok) {
      throw new Error(`Buttondown API ${res.status}: ${await res.text()}`);
    }
    const data = await res.json();
    subscribers.push(...(data.results ?? []));
    url = data.next;
  }
  return subscribers;
}

function toRow(sub) {
  const date = (sub.creation_date ?? sub.subscription_date ?? '').slice(0, 10);
  const meta = sub.metadata ?? {};
  const name = meta.name ?? '';
  const country = meta.country ?? '';
  // "regular" means the double opt-in confirmation was completed.
  const confirmed = (sub.type ?? sub.subscriber_type) === 'regular';
  const consent = confirmed ? 'Yes (confirmed)' : 'Pending';
  return [date, name, sub.email_address, country, consent].map(csvCell).join(',');
}

async function run() {
  const subs = await fetchAll();
  const header = 'Date,Name,Email,Country,Consent';
  const rows = subs.map(toRow);
  await fs.writeFile(OUT, [header, ...rows].join('\n') + '\n', 'utf8');
  console.log(`[sync-subscribers] wrote ${rows.length} subscribers -> subscribers.csv`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
