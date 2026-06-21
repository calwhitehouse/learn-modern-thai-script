import { seededShuffle, shuffle } from "@/lib/quiz-utils";
import { isDue } from "@/lib/srs";
import type { QuizCard, UserCardProgress } from "@/lib/types";

export const SESSION_SIZE = 10;

export type DistractorPoolItem = {
  text: string;
  difficulty: number;
};

export function buildChoices(
  answer: string,
  pool: DistractorPoolItem[],
  targetDifficulty: number,
  count = 4,
  seed: string,
): string[] {
  const others = pool.filter((p) => p.text !== answer);
  const similar = others.filter(
    (p) => Math.abs(p.difficulty - targetDifficulty) <= 1,
  );
  const source = similar.length >= count - 1 ? similar : others;
  const picked = seededShuffle(source, `${seed}:d`).slice(0, count - 1);
  return seededShuffle(
    [answer, ...picked.map((p) => p.text)],
    `${seed}:c`,
  );
}

export function poolFromCards(cards: QuizCard[]): DistractorPoolItem[] {
  const seen = new Set<string>();
  const items: DistractorPoolItem[] = [];
  for (const card of cards) {
    if (seen.has(card.answer_text)) continue;
    seen.add(card.answer_text);
    items.push({ text: card.answer_text, difficulty: card.difficulty });
  }
  return items;
}

export function rankCardsForSession(
  cards: QuizCard[],
  progress: Pick<
    UserCardProgress,
    "card_id" | "next_review_at" | "mastered_at" | "correct_count" | "incorrect_count"
  >[],
): QuizCard[] {
  const progressByCard = new Map(progress.map((p) => [p.card_id, p]));

  const scored = cards
    .filter((card) => !progressByCard.get(card.id)?.mastered_at)
    .map((card) => {
      const p = progressByCard.get(card.id);
      const attempts = (p?.correct_count ?? 0) + (p?.incorrect_count ?? 0);
      const due = p ? isDue(p.next_review_at, p.mastered_at) : true;
      const dueAt = p?.next_review_at ? new Date(p.next_review_at).getTime() : 0;

      return { card, attempts, due, dueAt };
    });

  scored.sort((a, b) => {
    if (a.due !== b.due) return a.due ? -1 : 1;
    if (a.dueAt !== b.dueAt) return a.dueAt - b.dueAt;
    return a.attempts - b.attempts;
  });

  return scored.map((s) => s.card);
}

export function selectPracticeSessionCards(
  cards: QuizCard[],
  progress: Pick<
    UserCardProgress,
    "card_id" | "next_review_at" | "mastered_at" | "correct_count" | "incorrect_count"
  >[],
  limit = SESSION_SIZE,
): QuizCard[] {
  const progressByCard = new Map(progress.map((p) => [p.card_id, p]));
  const active = rankCardsForSession(cards, progress);
  const mastered = cards.filter((c) => progressByCard.get(c.id)?.mastered_at);

  const session = active.slice(0, limit);
  if (session.length < limit && mastered.length > 0) {
    const extra = shuffle(mastered).slice(0, limit - session.length);
    session.push(...extra);
  }

  return shuffle(session.slice(0, limit));
}
