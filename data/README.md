# Data files for imports

Use this folder to bulk-add cards. The app reads from Supabase; these files are only for generating SQL.

## Thai consonants (44 letters)

[`thai-consonants.csv`](thai-consonants.csv) defines the official order, Thai names, and English meanings.

Regenerate the keyboard and letter-deck SQL after editing the CSV:

```bash
npm run generate:consonants
```

Then run **`supabase/sync-consonants.sql`** in the Supabase SQL Editor (production).

## Importing words and sentences

## Step 1 — Add your lists

Choose **CSV** (easiest from Excel/Google Sheets) or **JSON**.

### Option A: CSV (recommended)

1. Copy `words.example.csv` → `words.csv`
2. Copy `sentences.example.csv` → `sentences.csv`
3. Paste your 100 rows into each file (keep the header row)
4. Save as **UTF-8** (in Excel: Save As → CSV UTF-8)

| Column | Required | Notes |
|--------|----------|--------|
| `prompt_text` | Yes | Shown in modern font |
| `answer_text` | Yes | Looped form (usually same spelling as prompt) |
| `explanation` | No | Short English hint |
| `difficulty` | No | 1–5 (default: words `1`, sentences `2`) |

### Option B: JSON

1. Copy `words.example.json` → `words.json`
2. Copy `sentences.example.json` → `sentences.json`
3. Paste your arrays (100 objects each)

## Step 2 — Generate SQL

From the project root:

```bash
npm run import:cards
```

This writes **`supabase/import-cards.sql`** (does not change `seed.sql`).

## Step 3 — Run in Supabase

1. Open your project → **SQL Editor**
2. Paste/run the contents of `supabase/import-cards.sql`
3. Safe to re-run: existing `prompt_text` values in each deck are skipped

## Tips

- For this trainer, `prompt_text` and `answer_text` are often **identical** (same Thai string, different fonts in the UI).
- Avoid commas inside fields in CSV unless the field is wrapped in double quotes: `"hello, world"`
- After import, practice at `/practice/words` and `/practice/sentences`
