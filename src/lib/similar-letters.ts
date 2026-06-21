import poolsConfig from "../../data/similar-letter-pools.json";
import { normalizeThai } from "@/lib/thai-text";

/** Deck slug — keep in sync with `public.decks` and `DeckSlug` type. */
export const SIMILAR_LETTERS_DECK_SLUG = "similar-letters" as const;

export const MAX_SIMILAR_CHOICES = poolsConfig.maxChoices;

export type SimilarDrillSet = {
  id: string;
  /** Letters shown as looped choices (2–5). */
  letters: readonly string[];
  poolId: string;
};

type PoolConfig = {
  id: string;
  letters: string[];
};

function combinations<T>(items: readonly T[], size: number): T[][] {
  if (size <= 0 || size > items.length) return [];
  if (size === items.length) return [[...items]];
  if (size === 1) return items.map((item) => [item]);

  const result: T[][] = [];
  for (let i = 0; i <= items.length - size; i++) {
    const head = items[i];
    for (const tail of combinations(items.slice(i + 1), size - 1)) {
      result.push([head, ...tail]);
    }
  }
  return result;
}

function setKey(letters: readonly string[]): string {
  return [...letters].map(normalizeThai).sort().join("\u0001");
}

function buildDrillSets(pools: PoolConfig[]): SimilarDrillSet[] {
  const maxChoices = poolsConfig.maxChoices;
  const minCombinationSize = poolsConfig.minCombinationSize;
  const seen = new Set<string>();
  const drillSets: SimilarDrillSet[] = [];

  for (const pool of pools) {
    const letters = [...pool.letters];
    const sizes: number[] = [];

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

const POOLS = poolsConfig.pools as PoolConfig[];

export const SIMILAR_DRILL_SETS: readonly SimilarDrillSet[] = buildDrillSets(POOLS);

const drillSetById = new Map<string, SimilarDrillSet>(
  SIMILAR_DRILL_SETS.map((set) => [set.id, set]),
);

const drillSetsByLetter = new Map<string, SimilarDrillSet[]>();

for (const set of SIMILAR_DRILL_SETS) {
  for (const letter of set.letters) {
    const key = normalizeThai(letter);
    const list = drillSetsByLetter.get(key) ?? [];
    list.push(set);
    drillSetsByLetter.set(key, list);
  }
}

export function getSimilarDrillSet(setId: string | null | undefined): SimilarDrillSet | null {
  if (!setId) return null;
  return drillSetById.get(setId) ?? null;
}

/** Choice set for a card — prefers the card's drill set id, else any set containing the letter. */
export function getSimilarDrillSetForCard(
  answerLetter: string,
  setId?: string | null,
): SimilarDrillSet | null {
  const fromId = getSimilarDrillSet(setId);
  if (fromId) return fromId;

  const letterKey = normalizeThai(answerLetter);
  return drillSetsByLetter.get(letterKey)?.[0] ?? null;
}

export function getSimilarDrillSetsForLetter(letter: string): readonly SimilarDrillSet[] {
  return drillSetsByLetter.get(normalizeThai(letter)) ?? [];
}

/** @deprecated Use getSimilarDrillSetForCard */
export function getSimilarLetterGroup(letter: string) {
  const set = getSimilarDrillSetForCard(letter);
  if (!set) return null;
  return {
    id: set.id,
    label: set.letters.join(" "),
    letters: set.letters,
    tip: "",
  };
}

/** All distinct letters used across drill sets (for seeding). */
export function getAllSimilarLetters(): string[] {
  const letters = new Set<string>();
  for (const set of SIMILAR_DRILL_SETS) {
    for (const letter of set.letters) {
      letters.add(normalizeThai(letter));
    }
  }
  return [...letters].sort();
}

/** Max times the same target letter may appear in one practice session. */
export const SIMILAR_LETTER_MAX_PER_ANSWER = 2;
