/**
 * Reads data/similar-letter-pools.json + letter CSVs and writes:
 * - supabase/sync-similar-letters.sql (production upsert)
 * - Updates supabase/seed.sql similar-letters section
 *
 * Usage: npm run generate:similar-letters
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const poolsPath = path.join(root, "data", "similar-letter-pools.json");
const consonantsPath = path.join(root, "data", "thai-consonants.csv");
const vowelsMarksPath = path.join(root, "data", "thai-vowels-marks.csv");
const seedPath = path.join(root, "supabase", "seed.sql");
const syncPath = path.join(root, "supabase", "sync-similar-letters.sql");

function parseCsv(text) {
  const lines = text.trim().split(/\r?\n/);
  const headers = lines[0].split(",");
  return lines.slice(1).map((line) => {
    const parts = [];
    let field = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        inQuotes = !inQuotes;
        continue;
      }
      if (ch === "," && !inQuotes) {
        parts.push(field);
        field = "";
        continue;
      }
      field += ch;
    }
    parts.push(field);
    const row = {};
    headers.forEach((h, i) => {
      row[h.trim()] = (parts[i] ?? "").trim();
    });
    return row;
  });
}

function sqlEscape(value) {
  return value.replace(/'/g, "''");
}

function explanation(row) {
  const letter = row["Thai Letter"];
  const phonetic = row.Phonetic;
  const meaning = row.Meaning;
  return `${letter} — ${phonetic} (${meaning})`;
}

function consonantDifficulty(row) {
  const letter = row["Thai Letter"];
  if (row.Class === "Special Character") return 2;
  const easy = new Set([
    "ก",
    "ข",
    "ค",
    "ง",
    "จ",
    "ช",
    "ซ",
    "ด",
    "ต",
    "ท",
    "น",
    "บ",
    "ป",
    "พ",
    "ม",
    "ย",
    "ร",
    "ล",
    "ว",
    "ส",
    "อ",
  ]);
  return easy.has(letter) ? 1 : 2;
}

function vowelMarkDifficulty(row) {
  const d = Number.parseInt(row.Difficulty, 10);
  return Number.isFinite(d) && d >= 1 && d <= 5 ? d : 2;
}

function combinations(items, size) {
  if (size <= 0 || size > items.length) return [];
  if (size === items.length) return [[...items]];
  if (size === 1) return items.map((item) => [item]);

  const result = [];
  for (let i = 0; i <= items.length - size; i++) {
    const head = items[i];
    for (const tail of combinations(items.slice(i + 1), size - 1)) {
      result.push([head, ...tail]);
    }
  }
  return result;
}

function setKey(letters) {
  return [...letters].sort().join("\u0001");
}

function buildDrillSets(poolsConfig) {
  const maxChoices = poolsConfig.maxChoices;
  const minCombinationSize = poolsConfig.minCombinationSize;
  const seen = new Set();
  const drillSets = [];

  for (const pool of poolsConfig.pools) {
    const letters = [...pool.letters];
    const sizes = [];

    if (letters.length <= maxChoices) {
      sizes.push(letters.length);
    } else {
      sizes.push(maxChoices);
      if (letters.length >= minCombinationSize && minCombinationSize < maxChoices) {
        sizes.push(minCombinationSize);
      }
    }

    for (const size of sizes) {
      const combos = combinations(letters, size);
      combos.forEach((combo, index) => {
        const key = setKey(combo);
        if (seen.has(key)) return;
        seen.add(key);
        drillSets.push({
          id: `${pool.id}-${size}-${index + 1}`,
          letters: combo,
          poolId: pool.id,
        });
      });
    }
  }

  return drillSets;
}

const poolsConfig = JSON.parse(fs.readFileSync(poolsPath, "utf8"));
const drillSets = buildDrillSets(poolsConfig);

const letterMeta = new Map();
for (const row of parseCsv(fs.readFileSync(consonantsPath, "utf8"))) {
  letterMeta.set(row["Thai Letter"], {
    explanation: explanation(row),
    difficulty: consonantDifficulty(row),
  });
}
for (const row of parseCsv(fs.readFileSync(vowelsMarksPath, "utf8"))) {
  letterMeta.set(row["Thai Letter"], {
    explanation: explanation(row),
    difficulty: vowelMarkDifficulty(row),
  });
}

const cards = [];
for (const set of drillSets) {
  for (const letter of set.letters) {
    const meta = letterMeta.get(letter);
    if (!meta) {
      throw new Error(`Missing explanation for letter: ${letter} (set ${set.id})`);
    }
    cards.push({
      setId: set.id,
      letter,
      explanation: meta.explanation,
      difficulty: meta.difficulty,
    });
  }
}

function cardSqlRow(card) {
  const { letter, explanation: expl, difficulty, setId } = card;
  return `    ('${letter}', '${letter}', '${sqlEscape(expl)}', ${difficulty}, '${sqlEscape(setId)}')`;
}

const cardValues = cards.map(cardSqlRow).join(",\n");

const insertBlock = `-- Similar letters (${cards.length} cards across ${drillSets.length} drill sets; max ${poolsConfig.maxChoices} choices)
insert into public.cards (deck_id, type, prompt_text, answer_text, explanation, difficulty, similar_set_id)
select d.id, 'letter', v.prompt_text, v.answer_text, v.explanation, v.difficulty, v.similar_set_id
from public.decks d
cross join (
  values
${cardValues}
) as v(prompt_text, answer_text, explanation, difficulty, similar_set_id)
where d.slug = 'similar-letters'
  and not exists (
    select 1 from public.cards c
    where c.deck_id = d.id
      and c.similar_set_id = v.similar_set_id
      and c.answer_text = v.answer_text
  );`;

const syncSql = `-- Run in Supabase SQL Editor to sync the Similar letters deck.
-- Generated by npm run generate:similar-letters — do not edit by hand.
-- Safe to re-run: deactivates legacy one-card-per-letter rows and upserts drill-set cards.

-- Column for drill-set identity (skip if already applied).
alter table public.cards add column if not exists similar_set_id text;

create unique index if not exists cards_similar_drill_uniq
  on public.cards (deck_id, similar_set_id, answer_text)
  where similar_set_id is not null;

insert into public.decks (slug, title, description, sort_order)
values
  (
    'similar-letters',
    'Similar letters',
    'Easy-to-confuse letters — choose the right looped form from a small set.',
    2
  )
on conflict (slug) do update set
  title = excluded.title,
  description = excluded.description,
  sort_order = excluded.sort_order;

update public.decks set sort_order = 3 where slug = 'words';
update public.decks set sort_order = 4 where slug = 'sentences';

-- Retire old similar-letter cards (one row per letter, no drill set).
update public.cards c
set is_active = false
from public.decks d
where c.deck_id = d.id
  and d.slug = 'similar-letters'
  and c.similar_set_id is null;

${insertBlock}

-- Match letter names/notes from the Letters deck (same success text as letter picker).
update public.cards sl
set
  explanation = l.explanation,
  difficulty = l.difficulty
from public.cards l
join public.decks sl_deck on sl_deck.slug = 'similar-letters'
join public.decks l_deck on l_deck.slug = 'letters'
where sl.deck_id = sl_deck.id
  and l.deck_id = l_deck.id
  and sl.answer_text = l.answer_text
  and sl.similar_set_id is not null;
`;

fs.writeFileSync(syncPath, syncSql);

const seedContent = fs.readFileSync(seedPath, "utf8");
const seedMarkerStart = "-- Similar letters (confusable sets in modern script)";
const seedMarkerEnd = "-- Words";

const seedInsert = `${seedMarkerStart}
${insertBlock}
`;

const updatedSeed = seedContent.replace(
  /-- Similar letters[\s\S]*?(?=-- Words)/,
  `${seedInsert}\n`,
);

if (updatedSeed === seedContent) {
  throw new Error("Could not find similar-letters section in seed.sql");
}

fs.writeFileSync(seedPath, updatedSeed);

console.log(
  `Generated ${cards.length} similar-letter cards in ${drillSets.length} drill sets (max ${poolsConfig.maxChoices} choices).`,
);
console.log(`  ${syncPath}`);
console.log(`  ${seedPath} (similar-letters section)`);
