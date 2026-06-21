import { rankCardsForSession, SESSION_SIZE } from "@/lib/quiz";
import { shuffle } from "@/lib/quiz-utils";
import {
  buildRecentItemPenaltyMap,
  PRIOR_SESSION_ITEM_PENALTY,
  RECENT_SESSION_ITEM_PENALTY,
} from "@/lib/session-variety";
import { normalizeThai } from "@/lib/thai-text";
import type { QuizCard, UserCardProgress } from "@/lib/types";

export { RECENT_SESSION_ITEM_PENALTY, PRIOR_SESSION_ITEM_PENALTY };

export type DiversePracticeSessionOptions = {
  limit?: number;
  /** Prompt texts from prior practice sessions on this deck — [0] = most recent. */
  recentSessionPrompts?: string[][];
};

/** Prompt texts shown this session (unique, stable order). */
export function collectSessionPrompts(cards: Pick<QuizCard, "prompt_text">[]): string[] {
  const prompts: string[] = [];
  const seen = new Set<string>();
  for (const card of cards) {
    const key = normalizeThai(card.prompt_text);
    if (seen.has(key)) continue;
    seen.add(key);
    prompts.push(card.prompt_text);
  }
  return prompts;
}

function promptKey(card: QuizCard): string {
  return normalizeThai(card.prompt_text);
}

/**
 * Builds a practice session for letters / words / sentences — SRS order with
 * spread across prompts and deprioritisation of prompts from recent sessions.
 */
export function selectDiversePracticeSessionCards(
  cards: QuizCard[],
  progress: Pick<
    UserCardProgress,
    "card_id" | "next_review_at" | "mastered_at" | "correct_count" | "incorrect_count"
  >[],
  options: DiversePracticeSessionOptions = {},
): QuizCard[] {
  const limit = options.limit ?? SESSION_SIZE;
  const recentSessionPrompts = options.recentSessionPrompts ?? [];

  if (cards.length === 0) return [];

  const progressByCard = new Map(progress.map((p) => [p.card_id, p]));
  const active = rankCardsForSession(cards, progress);
  const mastered = cards.filter((c) => progressByCard.get(c.id)?.mastered_at);

  let candidatePool = active;
  if (candidatePool.length < limit && mastered.length > 0) {
    candidatePool = [...active, ...shuffle(mastered)];
  }

  if (candidatePool.length <= limit) {
    return shuffle(pickDiverseSession(candidatePool, candidatePool.length, recentSessionPrompts));
  }

  return pickDiverseSession(candidatePool, limit, recentSessionPrompts);
}

function pickDiverseSession(
  ranked: QuizCard[],
  limit: number,
  recentSessionPrompts: string[][],
): QuizCard[] {
  const session: QuizCard[] = [];
  const remaining = new Set(ranked.map((c) => c.id));
  const rankIndex = new Map(ranked.map((card, index) => [card.id, index]));
  const recentPromptPenalty = buildRecentItemPenaltyMap(
    recentSessionPrompts.map((session) => session.map(normalizeThai)),
  );
  const usedPrompts = new Set<string>();

  while (session.length < limit && remaining.size > 0) {
    const picked =
      pickBestCandidate({
        ranked,
        remaining,
        rankIndex,
        usedPrompts,
        recentPromptPenalty,
        allowDuplicatePrompt: false,
      }) ??
      pickBestCandidate({
        ranked,
        remaining,
        rankIndex,
        usedPrompts,
        recentPromptPenalty,
        allowDuplicatePrompt: true,
      });

    if (!picked) break;

    session.push(picked);
    remaining.delete(picked.id);
    usedPrompts.add(promptKey(picked));
  }

  return shuffle(session);
}

function pickBestCandidate({
  ranked,
  remaining,
  rankIndex,
  usedPrompts,
  recentPromptPenalty,
  allowDuplicatePrompt,
}: {
  ranked: QuizCard[];
  remaining: Set<string>;
  rankIndex: Map<string, number>;
  usedPrompts: Set<string>;
  recentPromptPenalty: Map<string, number>;
  allowDuplicatePrompt: boolean;
}): QuizCard | null {
  let best: QuizCard | null = null;
  let bestScore = -Infinity;

  for (const card of ranked) {
    if (!remaining.has(card.id)) continue;

    const key = promptKey(card);
    if (!allowDuplicatePrompt && usedPrompts.has(key)) continue;

    const rank = rankIndex.get(card.id) ?? ranked.length;
    let score = (ranked.length - rank) * 100;

    if (!usedPrompts.has(key)) score += 400;

    score -= recentPromptPenalty.get(key) ?? 0;

    if (score > bestScore) {
      bestScore = score;
      best = card;
    }
  }

  return best;
}
