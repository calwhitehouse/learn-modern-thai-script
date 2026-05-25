export type DeckSlug = "letters" | "words" | "sentences";

export type CardType = "letter" | "word" | "sentence";

export type Deck = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  sort_order: number;
};

export type Card = {
  id: string;
  deck_id: string;
  type: CardType;
  prompt_text: string;
  answer_text: string;
  explanation: string;
  difficulty: number;
};

export type QuizCard = Pick<
  Card,
  "id" | "type" | "prompt_text" | "answer_text" | "explanation" | "difficulty"
>;

export type QuizCardWithDeck = QuizCard & { deck_id?: string };

export type UserCardProgress = {
  user_id: string;
  card_id: string;
  correct_count: number;
  incorrect_count: number;
  current_streak: number;
  interval_days: number;
  next_review_at: string | null;
  mastered_at: string | null;
};

export type ProgressStats = {
  cardsCompleted: number;
  perfectCompletions: number;
  perfectRatePercent: number;
  totalWrongLetterTaps: number;
  masteredCount: number;
  dueCount: number;
  cardsStudied: number;
};

export type FullProgressStats = ProgressStats & {
  strongestDeck: { title: string; accuracy: number } | null;
  weakestDeck: { title: string; accuracy: number } | null;
  mostMissed: Array<{ promptText: string; incorrectCount: number }>;
};
