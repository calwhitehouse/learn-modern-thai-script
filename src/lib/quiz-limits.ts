/** Max length for quiz_attempts.selected_answer (Thai sentences stay well under this). */
export const QUIZ_SELECTED_ANSWER_MAX_LENGTH = 500;

export function isQuizSelectedAnswerLengthValid(value: string): boolean {
  return value.length > 0 && value.length <= QUIZ_SELECTED_ANSWER_MAX_LENGTH;
}
