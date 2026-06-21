import { rankCardsForSession, SESSION_SIZE } from "@/lib/quiz";
import { shuffle } from "@/lib/quiz-utils";
import {
  getSimilarDrillSet,
  SIMILAR_LETTER_MAX_PER_ANSWER,
} from "@/lib/similar-letters";
import {
  buildRecentItemPenaltyMap,
  PRIOR_SESSION_ITEM_PENALTY,
  RECENT_SESSION_ITEM_PENALTY,
} from "@/lib/session-variety";
import { normalizeThai } from "@/lib/thai-text";
import type { QuizCard, UserCardProgress } from "@/lib/types";

export {
  RECENT_SESSION_ITEM_PENALTY as RECENT_DRILL_SET_PENALTY,
  PRIOR_SESSION_ITEM_PENALTY as PRIOR_DRILL_SET_PENALTY,
};

export type SimilarLettersSessionOptions = {
  limit?: number;
  /** Drill set ids from prior sessions — [0] = most recent, [1] = before that. */
  recentSessionDrillSetIds?: string[][];
};

/** Unique drill set ids from a session queue (stable order). */
export function collectDrillSetIds(
  cards: Pick<QuizCard, "similar_set_id">[],
): string[] {
  const ids: string[] = [];
  const seen = new Set<string>();
  for (const card of cards) {
    const setId = card.similar_set_id;
    if (!setId || seen.has(setId)) continue;
    seen.add(setId);
    ids.push(setId);
  }
  return ids;
}

/**
 * Builds a 10-card session that spreads prompts across letters, drill sets,
 * and visual pools while still preferring due / less-practiced cards.
 */
export function selectSimilarLettersSessionCards(
  cards: QuizCard[],
  progress: Pick<
    UserCardProgress,
    "card_id" | "next_review_at" | "mastered_at" | "correct_count" | "incorrect_count"
  >[],
  options: SimilarLettersSessionOptions = {},
): QuizCard[] {
  const limit = options.limit ?? SESSION_SIZE;
  const recentSessionDrillSetIds = options.recentSessionDrillSetIds ?? [];

  if (cards.length === 0) return [];

  const progressByCard = new Map(progress.map((p) => [p.card_id, p]));
  const active = rankCardsForSession(cards, progress);
  const mastered = cards.filter((c) => progressByCard.get(c.id)?.mastered_at);

  let candidatePool = active;
  if (candidatePool.length < limit && mastered.length > 0) {
    candidatePool = [...active, ...shuffle(mastered)];
  }

  if (candidatePool.length <= limit) {
    return shuffle(
      pickDiverseSession(candidatePool, candidatePool.length, recentSessionDrillSetIds),
    );
  }

  return pickDiverseSession(candidatePool, limit, recentSessionDrillSetIds);
}

type PickConstraints = "strict" | "relaxed-letter" | "any";

function pickDiverseSession(
  ranked: QuizCard[],
  limit: number,
  recentSessionDrillSetIds: string[][],
): QuizCard[] {
  const session: QuizCard[] = [];
  const remaining = new Set(ranked.map((c) => c.id));
  const rankIndex = new Map(ranked.map((card, index) => [card.id, index]));
  const recentSetPenalty = buildRecentItemPenaltyMap(recentSessionDrillSetIds);

  const usedSetIds = new Set<string>();
  const usedLetterCount = new Map<string, number>();
  const usedPoolIds = new Set<string>();

  const constraintPasses: PickConstraints[] = ["strict", "relaxed-letter", "any"];

  while (session.length < limit && remaining.size > 0) {
    let picked: QuizCard | null = null;

    for (const constraints of constraintPasses) {
      picked = pickBestCandidate({
        ranked,
        remaining,
        rankIndex,
        usedSetIds,
        usedLetterCount,
        usedPoolIds,
        recentSetPenalty,
        constraints,
      });
      if (picked) break;
    }

    if (!picked) break;

    session.push(picked);
    remaining.delete(picked.id);

    if (picked.similar_set_id) {
      usedSetIds.add(picked.similar_set_id);
    }

    const letterKey = normalizeThai(picked.answer_text);
    usedLetterCount.set(letterKey, (usedLetterCount.get(letterKey) ?? 0) + 1);

    const drillSet = getSimilarDrillSet(picked.similar_set_id);
    if (drillSet) {
      usedPoolIds.add(drillSet.poolId);
    }
  }

  return shuffle(session);
}

function pickBestCandidate({
  ranked,
  remaining,
  rankIndex,
  usedSetIds,
  usedLetterCount,
  usedPoolIds,
  recentSetPenalty,
  constraints,
}: {
  ranked: QuizCard[];
  remaining: Set<string>;
  rankIndex: Map<string, number>;
  usedSetIds: Set<string>;
  usedLetterCount: Map<string, number>;
  usedPoolIds: Set<string>;
  recentSetPenalty: Map<string, number>;
  constraints: PickConstraints;
}): QuizCard | null {
  let best: QuizCard | null = null;
  let bestScore = -Infinity;

  for (const card of ranked) {
    if (!remaining.has(card.id)) continue;

    const setId = card.similar_set_id;
    const letterKey = normalizeThai(card.answer_text);
    const letterCount = usedLetterCount.get(letterKey) ?? 0;

    if (setId && usedSetIds.has(setId)) continue;

    if (constraints === "strict" && letterCount >= 1) continue;
    if (constraints === "relaxed-letter" && letterCount >= SIMILAR_LETTER_MAX_PER_ANSWER) {
      continue;
    }

    const rank = rankIndex.get(card.id) ?? ranked.length;
    let score = (ranked.length - rank) * 100;

    if (letterCount === 0) score += 800;
    else if (letterCount < SIMILAR_LETTER_MAX_PER_ANSWER) score += 200;

    const drillSet = getSimilarDrillSet(setId);
    if (drillSet && !usedPoolIds.has(drillSet.poolId)) score += 400;

    if (setId) {
      score -= recentSetPenalty.get(setId) ?? 0;
    }

    if (score > bestScore) {
      bestScore = score;
      best = card;
    }
  }

  return best;
}

export function isSimilarLettersDeck(cards: QuizCard[]): boolean {
  return cards.some((card) => Boolean(card.similar_set_id));
}
