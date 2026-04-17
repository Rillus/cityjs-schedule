/**
 * Fetches talk abstracts and speaker metadata from the official CityJS London
 * site (Next.js RSC payload on /speakers) and merges them into public/cityjs-london.json.
 *
 * Run: node scripts/fetch-cityjs-talk-details.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const SCHEDULE_PATH = path.join(ROOT, 'public', 'cityjs-london.json');
const SPEAKERS_URL = 'https://london.cityjsconf.org/speakers';

function findMatchingArrayEnd(str, start) {
  const stack = [];
  let inString = false;
  let escape = false;
  for (let i = start; i < str.length; i++) {
    const c = str[i];
    if (inString) {
      if (escape) escape = false;
      else if (c === '\\') escape = true;
      else if (c === '"') inString = false;
      continue;
    }
    if (c === '"') {
      inString = true;
      continue;
    }
    if (c === '[') stack.push('[');
    else if (c === '{') stack.push('{');
    else if (c === '}') stack.pop();
    else if (c === ']') {
      stack.pop();
      if (stack.length === 0) return i;
    }
  }
  return -1;
}

function richTextToPlain(doc) {
  if (!doc || !doc.content) return '';
  const parts = [];
  function walk(nodes) {
    if (!nodes) return;
    for (const n of nodes) {
      if (n.nodeType === 'text' && n.value) parts.push(n.value);
      if (n.content) walk(n.content);
    }
  }
  walk(doc.content);
  return parts.join('\n\n').trim();
}

function normalise(s) {
  return (s || '')
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/[—–]/g, '—')
    .replace(/\u2018|\u2019|\u02bc|`/g, "'")
    .toLowerCase();
}

function splitEventName(name) {
  const m = name.match(/^(.+?)\s[—–]\s(.+)$/);
  if (m) return { title: m[1].trim(), speaker: m[2].trim() };
  return { title: name.trim(), speaker: null };
}

function rowFullName(row) {
  return `${row.talk.fields.talkTitle} — ${row.speakerName}`;
}

function imageUrl(row) {
  const u = row.imageUrl;
  if (!u) return undefined;
  return u.startsWith('//') ? `https:${u}` : u;
}

function findMatches(eventName, rows) {
  const n = normalise(eventName);
  const exactIdx = rows.findIndex((r) => normalise(rowFullName(r)) === n);
  if (exactIdx !== -1) return [rows[exactIdx]];

  const { title, speaker } = splitEventName(eventName);
  const nt = normalise(title);
  const ns = speaker ? normalise(speaker) : null;

  let candidates = rows.filter((r) => normalise(r.talk.fields.talkTitle) === nt);
  if (!candidates.length) return [];

  if (!ns) return candidates;

  const bySpeaker = candidates.filter((r) => normalise(r.speakerName) === ns);
  if (bySpeaker.length) return bySpeaker;

  if (speaker.includes('&')) {
    const parts = speaker.split(/\s*&\s*/).map((p) => normalise(p));
    const multi = candidates.filter((r) => parts.includes(normalise(r.speakerName)));
    if (multi.length) return multi;
  }

  return [];
}

function mergeRows(matches) {
  const descs = [...new Set(matches.map((m) => richTextToPlain(m.talk.fields.description)).filter(Boolean))];
  const description = descs.length === 1 ? descs[0] : descs.join('\n\n');

  const speakerBlocks = matches.map((m) => {
    const name = m.speakerName.trim();
    const bioLines = Array.isArray(m.bio) ? m.bio.join('\n\n') : m.bio || '';
    const company = (m.company || '').trim();
    const head = company ? `${name} — ${company}` : name;
    return bioLines ? `${head}\n\n${bioLines}` : head;
  });
  const speakerBio = [...new Set(speakerBlocks)].join('\n\n---\n\n');

  const first = matches[0];
  return {
    description: description || undefined,
    speakerBio: speakerBio || undefined,
    company: first.company?.trim() || undefined,
    image: imageUrl(first),
    twitter: first.twitter || undefined,
    linkedin: first.linkedin || undefined,
    bluesky: first.bluesky || undefined,
    url: SPEAKERS_URL,
  };
}

async function main() {
  const res = await fetch(SPEAKERS_URL, {
    headers: {
      RSC: '1',
      'Next-Url': '/speakers',
    },
  });
  if (!res.ok) throw new Error(`Fetch speakers failed: ${res.status}`);
  const rsc = await res.text();
  const needle = '"speakers":[';
  const p = rsc.indexOf(needle);
  if (p === -1) throw new Error('Could not find speakers payload (site markup may have changed).');
  const br = p + needle.length - 1;
  const end = findMatchingArrayEnd(rsc, br);
  const rows = JSON.parse(rsc.slice(br, end + 1));

  const raw = fs.readFileSync(SCHEDULE_PATH, 'utf8');
  const data = JSON.parse(raw);
  let merged = 0;
  let missed = [];

  for (const loc of data.locations) {
    for (const ev of loc.events) {
      const matches = findMatches(ev.name, rows);
      if (!matches.length) {
        missed.push(ev.name);
        continue;
      }
      const extra = mergeRows(matches);
      Object.assign(ev, extra);
      merged++;
    }
  }

  const suffix = ' · talk details from cityjsconf.org speakers RSC';
  data.modified = `${(data.modified || '').replace(/\s*· talk details from cityjsconf\.org speakers RSC\s*$/, '').trim()}${suffix}`;

  fs.writeFileSync(SCHEDULE_PATH, `${JSON.stringify(data, null, 2)}\n`);
  console.error(`Merged official talk details for ${merged} sessions (${missed.length} without CMS match).`);
  if (missed.length) {
    console.error('Unmatched (breaks, MC-only slots, placeholder days, or title drift):');
    for (const m of missed) console.error(`  - ${m}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
