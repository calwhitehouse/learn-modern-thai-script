/**
 * Reads data/words.{csv|json} and data/sentences.{csv|json}
 * and writes supabase/import-cards.sql
 *
 * Usage: npm run import:cards
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const dataDir = path.join(root, "data");
const outFile = path.join(root, "supabase", "import-cards.sql");

function readFileIfExists(filePath) {
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8") : null;
}

function sqlEscape(value) {
  return value.replace(/'/g, "''");
}

/** Minimal RFC-style CSV parser (UTF-8, quoted fields). */
function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    const next = text[i + 1];

    if (inQuotes) {
      if (ch === '"' && next === '"') {
        field += '"';
        i += 1;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        field += ch;
      }
      continue;
    }

    if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      row.push(field.trim());
      field = "";
    } else if (ch === "\n" || (ch === "\r" && next === "\n")) {
      row.push(field.trim());
      field = "";
      if (row.some((c) => c.length > 0)) rows.push(row);
      row = [];
      if (ch === "\r") i += 1;
    } else if (ch !== "\r") {
      field += ch;
    }
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field.trim());
    if (row.some((c) => c.length > 0)) rows.push(row);
  }

  return rows;
}

function csvToRecords(text, defaultDifficulty) {
  const rows = parseCsv(text.trim());
  if (rows.length < 2) return [];

  const header = rows[0].map((h) => h.toLowerCase());
  const idx = {
    prompt: header.indexOf("prompt_text"),
    answer: header.indexOf("answer_text"),
    explanation: header.indexOf("explanation"),
    difficulty: header.indexOf("difficulty"),
  };

  if (idx.prompt < 0 || idx.answer < 0) {
    throw new Error("CSV must include prompt_text and answer_text columns");
  }

  return rows.slice(1).map((cols) => {
    const prompt = cols[idx.prompt] ?? "";
    const answer = cols[idx.answer] ?? "";
    const explanation = idx.explanation >= 0 ? cols[idx.explanation] ?? "" : "";
    const diffRaw = idx.difficulty >= 0 ? cols[idx.difficulty] : "";
    const difficulty = diffRaw ? Number(diffRaw) : defaultDifficulty;

    return {
      prompt_text: prompt,
      answer_text: answer,
      explanation,
      difficulty: Number.isFinite(difficulty) ? Math.min(5, Math.max(1, difficulty)) : defaultDifficulty,
    };
  });
}

function jsonToRecords(text, defaultDifficulty) {
  const data = JSON.parse(text);
  if (!Array.isArray(data)) throw new Error("JSON root must be an array");

  return data.map((item) => normalizeItem(item, defaultDifficulty));
}

/** Supports app format, CSV headers, and { thai, translation } exports. */
function normalizeItem(item, defaultDifficulty) {
  const thai = String(item.prompt_text ?? item.thai ?? "").trim();
  const answer = String(item.answer_text ?? item.thai ?? thai).trim();
  const explanation = String(item.explanation ?? item.translation ?? "").trim();
  const difficultyRaw = item.difficulty ?? defaultDifficulty;
  const difficulty = Number(difficultyRaw);

  return {
    prompt_text: thai,
    answer_text: answer,
    explanation,
    difficulty: Number.isFinite(difficulty)
      ? Math.min(5, Math.max(1, difficulty))
      : defaultDifficulty,
  };
}

function loadDeckRecords(basename, defaultDifficulty) {
  const jsonPath = path.join(dataDir, `${basename}.json`);
  const csvPath = path.join(dataDir, `${basename}.csv`);

  const jsonRaw = readFileIfExists(jsonPath);
  if (jsonRaw) return jsonToRecords(jsonRaw, defaultDifficulty);

  const csvRaw = readFileIfExists(csvPath);
  if (csvRaw) return csvToRecords(csvRaw, defaultDifficulty);

  return null;
}

function validateRecords(records, label) {
  const valid = [];
  const skipped = [];

  for (let i = 0; i < records.length; i += 1) {
    const r = records[i];
    if (!r.prompt_text || !r.answer_text) {
      skipped.push({ line: i + 1, reason: "missing prompt_text or answer_text" });
      continue;
    }
    valid.push(r);
  }

  if (skipped.length > 0) {
    console.warn(`[${label}] skipped ${skipped.length} row(s):`);
    skipped.slice(0, 5).forEach((s) => console.warn(`  line ${s.line}: ${s.reason}`));
    if (skipped.length > 5) console.warn(`  ... and ${skipped.length - 5} more`);
  }

  return valid;
}

function buildInsertSql(type, slug, records) {
  if (records.length === 0) return `-- No ${type} rows to import\n`;

  const valueLines = records.map((r) => {
    const expl = sqlEscape(r.explanation || "");
    return `    ('${sqlEscape(r.prompt_text)}', '${sqlEscape(r.answer_text)}', '${expl}', ${r.difficulty})`;
  });

  return `-- ${records.length} ${type}(s)
insert into public.cards (deck_id, type, prompt_text, answer_text, explanation, difficulty)
select d.id, '${type}', v.prompt_text, v.answer_text, v.explanation, v.difficulty
from public.decks d
cross join (
  values
${valueLines.join(",\n")}
) as v(prompt_text, answer_text, explanation, difficulty)
where d.slug = '${slug}'
  and not exists (
    select 1 from public.cards c
    where c.deck_id = d.id and c.prompt_text = v.prompt_text
  );
`;
}

function main() {
  const words = loadDeckRecords("words", 1);
  const sentences = loadDeckRecords("sentences", 2);

  if (!words && !sentences) {
    console.error("No import files found.");
    console.error("Add data/words.csv or data/words.json (and/or sentences.*)");
    console.error("See data/README.md for format.");
    process.exit(1);
  }

  const wordRecords = words ? validateRecords(words, "words") : [];
  const sentenceRecords = sentences ? validateRecords(sentences, "sentences") : [];

  const parts = [
    "-- Generated by: npm run import:cards",
    `-- ${new Date().toISOString()}`,
    "-- Run in Supabase SQL Editor after schema.sql + seed.sql",
    "-- Skips duplicates by prompt_text within each deck",
    "",
    "insert into public.decks (slug, title, description, sort_order)",
    "values",
    "  ('words', 'Words', 'High-frequency vocabulary', 2),",
    "  ('sentences', 'Sentences', 'Short everyday sentences', 3)",
    "on conflict (slug) do nothing;",
    "",
  ];

  if (wordRecords.length > 0) {
    parts.push(buildInsertSql("word", "words", wordRecords));
    parts.push("");
  }

  if (sentenceRecords.length > 0) {
    parts.push(buildInsertSql("sentence", "sentences", sentenceRecords));
    parts.push("");
  }

  fs.writeFileSync(outFile, parts.join("\n"), "utf8");

  console.log(`Wrote ${outFile}`);
  console.log(`  Words: ${wordRecords.length}`);
  console.log(`  Sentences: ${sentenceRecords.length}`);
}

main();
