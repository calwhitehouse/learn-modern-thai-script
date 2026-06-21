-- Add drill-set identity for similar-letters cards (run once on existing databases).
alter table public.cards add column if not exists similar_set_id text;

create unique index if not exists cards_similar_drill_uniq
  on public.cards (deck_id, similar_set_id, answer_text)
  where similar_set_id is not null;
