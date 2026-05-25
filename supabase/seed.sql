-- Run after schema.sql in Supabase SQL Editor

insert into public.decks (slug, title, description, sort_order)
values
  ('letters', 'Letters', 'All Thai consonants — match modern to looped forms', 1),
  ('words', 'Words', 'High-frequency vocabulary', 2),
  ('sentences', 'Sentences', 'Short everyday sentences', 3)
on conflict (slug) do update set
  title = excluded.title,
  description = excluded.description,
  sort_order = excluded.sort_order;

-- All 44 Thai consonants
insert into public.cards (deck_id, type, prompt_text, answer_text, explanation, difficulty)
select d.id, 'letter', v.prompt_text, v.answer_text, v.explanation, v.difficulty
from public.decks d
cross join (
  values
    ('ก', 'ก', 'ก — kor kai (chicken)', 1),
    ('ข', 'ข', 'ข — khor khai (egg)', 1),
    ('ฃ', 'ฃ', 'ฃ — khor khuat (obsolete; rare in modern text)', 2),
    ('ค', 'ค', 'ค — khor khwai (buffalo)', 1),
    ('ฅ', 'ฅ', 'ฅ — khor khon (obsolete)', 2),
    ('ฆ', 'ฆ', 'ฆ — khor rakhang (bell)', 2),
    ('ง', 'ง', 'ง — ngor ngu (snake)', 1),
    ('จ', 'จ', 'จ — jor jan (plate)', 1),
    ('ฉ', 'ฉ', 'ฉ — chor ching (cymbals)', 2),
    ('ช', 'ช', 'ช — chor chang (elephant)', 1),
    ('ซ', 'ซ', 'ซ — sor so (chain)', 1),
    ('ฌ', 'ฌ', 'ฌ — chor choe (tree)', 2),
    ('ญ', 'ญ', 'ญ — yor ying (woman)', 2),
    ('ด', 'ด', 'ด — dor dek (child)', 1),
    ('ต', 'ต', 'ต — tor tao (turtle)', 1),
    ('ถ', 'ถ', 'ถ — thor thung (sack)', 2),
    ('ท', 'ท', 'ท — thor thahan (soldier)', 1),
    ('ธ', 'ธ', 'ธ — thor phuthao (dhamma)', 2),
    ('น', 'น', 'น — nor nu (mouse)', 1),
    ('บ', 'บ', 'บ — bor baimai (leaf)', 1),
    ('ป', 'ป', 'ป — por pla (fish)', 1),
    ('ผ', 'ผ', 'ผ — phor phueng (bee)', 2),
    ('ฝ', 'ฝ', 'ฝ — for fa (lid)', 2),
    ('พ', 'พ', 'พ — por phan (tray)', 1),
    ('ฟ', 'ฟ', 'ฟ — for fan (teeth)', 2),
    ('ภ', 'ภ', 'ภ — phor samphao (sail)', 2),
    ('ม', 'ม', 'ม — mor ma (horse)', 1),
    ('ย', 'ย', 'ย — yor yak (giant)', 1),
    ('ร', 'ร', 'ร — ror reua (boat); often confused with ล', 2),
    ('ล', 'ล', 'ล — lor ling (monkey); often confused with ร', 2),
    ('ว', 'ว', 'ว — wor waen (ring)', 1),
    ('ศ', 'ศ', 'ศ — sor sala (pavilion)', 2),
    ('ษ', 'ษ', 'ษ — sor rue-si (hermit)', 2),
    ('ส', 'ส', 'ส — sor suea (tiger)', 1),
    ('ห', 'ห', 'ห — hor heep (chest)', 2),
    ('ฬ', 'ฬ', 'ฬ — lor chula (kite)', 2),
    ('อ', 'อ', 'อ — or ang (basin)', 1),
    ('ฮ', 'ฮ', 'ฮ — hor nok hoo (owl)', 2)
) as v(prompt_text, answer_text, explanation, difficulty)
where d.slug = 'letters'
  and not exists (
    select 1 from public.cards c
    where c.deck_id = d.id and c.prompt_text = v.prompt_text
  );

-- Words
insert into public.cards (deck_id, type, prompt_text, answer_text, explanation, difficulty)
select d.id, 'word', v.prompt_text, v.answer_text, v.explanation, v.difficulty
from public.decks d
cross join (
  values
    ('มา', 'มา', 'มา — to come', 1),
    ('ไป', 'ไป', 'ไป — to go', 1),
    ('กิน', 'กิน', 'กิน — to eat', 1),
    ('บ้าน', 'บ้าน', 'บ้าน — house / home', 2),
    ('ร้าน', 'ร้าน', 'ร้าน — shop', 2),
    ('ไทย', 'ไทย', 'ไทย — Thai', 1),
    ('คน', 'คน', 'คน — person', 1),
    ('น้ำ', 'น้ำ', 'น้ำ — water', 2)
) as v(prompt_text, answer_text, explanation, difficulty)
where d.slug = 'words'
  and not exists (
    select 1 from public.cards c
    where c.deck_id = d.id and c.prompt_text = v.prompt_text
  );

-- Sentences
insert into public.cards (deck_id, type, prompt_text, answer_text, explanation, difficulty)
select d.id, 'sentence', v.prompt_text, v.answer_text, v.explanation, v.difficulty
from public.decks d
cross join (
  values
    ('วันนี้อากาศร้อน', 'วันนี้อากาศร้อน', 'Today the weather is hot.', 2),
    ('ร้านนี้อร่อยมาก', 'ร้านนี้อร่อยมาก', 'This shop is very delicious.', 2),
    ('คุณไปไหน', 'คุณไปไหน', 'Where are you going?', 2),
    ('ราคาเท่าไหร่', 'ราคาเท่าไหร่', 'How much does it cost?', 2)
) as v(prompt_text, answer_text, explanation, difficulty)
where d.slug = 'sentences'
  and not exists (
    select 1 from public.cards c
    where c.deck_id = d.id and c.prompt_text = v.prompt_text
  );
