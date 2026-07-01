-- Remove nikhahit (ํ) from the letters deck.
-- Practice and spelling use ำ (sara am) as a single character instead.
-- Related user_card_progress and quiz_attempts rows cascade on delete.

delete from public.cards c
using public.decks d
where c.deck_id = d.id
  and d.slug = 'letters'
  and c.prompt_text = 'ํ';
