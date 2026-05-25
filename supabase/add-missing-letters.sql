-- Run in Supabase SQL Editor on production if the letters deck is missing consonants.
-- Safe to re-run (skips existing prompt_text).

insert into public.cards (deck_id, type, prompt_text, answer_text, explanation, difficulty)
select d.id, 'letter', v.prompt_text, v.answer_text, v.explanation, v.difficulty
from public.decks d
cross join (
  values
    ('ฎ', 'ฎ', 'ฎ — dor chada (headdress)', 2),
    ('ฏ', 'ฏ', 'ฏ — tor pantak (goad)', 2),
    ('ฐ', 'ฐ', 'ฐ — thor thong (flagpole)', 2),
    ('ณ', 'ณ', 'ณ — nor nen (novice monk)', 2),
    ('ฑ', 'ฑ', 'ฑ — thor montho (alcohol)', 2),
    ('ฒ', 'ฒ', 'ฒ — thor phusan (hermit)', 2)
) as v(prompt_text, answer_text, explanation, difficulty)
where d.slug = 'letters'
  and not exists (
    select 1 from public.cards c
    where c.deck_id = d.id and c.prompt_text = v.prompt_text
  );
