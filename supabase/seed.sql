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
    ('ก', 'ก', 'ก — กไก่ (Chicken)', 1),
    ('ข', 'ข', 'ข — ขไข่ (Egg)', 1),
    ('ฃ', 'ฃ', 'ฃ — ฃขวด (Bottle)', 2),
    ('ค', 'ค', 'ค — ค ควาย (Water Buffalo)', 1),
    ('ฅ', 'ฅ', 'ฅ — ฅ คน (Person)', 2),
    ('ฆ', 'ฆ', 'ฆ — ฆ ระฆัง (Temple Bell)', 2),
    ('ง', 'ง', 'ง — ง งู (Snake)', 1),
    ('จ', 'จ', 'จ — จ จาน (Plate)', 1),
    ('ฉ', 'ฉ', 'ฉ — ฉ ฉิ่ง (Small Cymbal)', 2),
    ('ช', 'ช', 'ช — ช ช้าง (Elephant)', 1),
    ('ซ', 'ซ', 'ซ — ซ โซ่ (Chain for Animals)', 1),
    ('ฌ', 'ฌ', 'ฌ — ฌ เฌอ (Small Tree)', 2),
    ('ญ', 'ญ', 'ญ — ญ หญิง (Woman)', 2),
    ('ฎ', 'ฎ', 'ฎ — ฎ ชฎา (Dance Hat)', 2),
    ('ฏ', 'ฏ', 'ฏ — ฏ ปฏัก (Harpoon)', 2),
    ('ฐ', 'ฐ', 'ฐ — ฐ ฐาน (Pedestal)', 2),
    ('ฑ', 'ฑ', 'ฑ — ฑ มณโฑ (Ramayana Character)', 2),
    ('ฒ', 'ฒ', 'ฒ — ฒ ผู้เฒ่า (Old Man)', 2),
    ('ณ', 'ณ', 'ณ — ณ เณร (Buddhist Monk)', 2),
    ('ด', 'ด', 'ด — ด เด็ก (Child)', 1),
    ('ต', 'ต', 'ต — ต เต่า (Turtle)', 1),
    ('ถ', 'ถ', 'ถ — ถ ถุง (Shopping Bag)', 2),
    ('ท', 'ท', 'ท — ท ทหาร (Soldier)', 1),
    ('ธ', 'ธ', 'ธ — ธ ธง (Flag)', 2),
    ('น', 'น', 'น — น หนู (Mouse)', 1),
    ('บ', 'บ', 'บ — บ ใบไม้ (Leaf)', 1),
    ('ป', 'ป', 'ป — ป ปลา (Fish)', 1),
    ('ผ', 'ผ', 'ผ — ผ ผึ้ง (Bee)', 2),
    ('ฝ', 'ฝ', 'ฝ — ฝ ฝา (Lid)', 2),
    ('พ', 'พ', 'พ — พ พาน (Offering Tray)', 1),
    ('ฟ', 'ฟ', 'ฟ — ฟ ฟัน (Tooth)', 2),
    ('ภ', 'ภ', 'ภ — ภ สำเภา (Small Chinese Boat)', 2),
    ('ม', 'ม', 'ม — ม ม้า (Horse)', 1),
    ('ย', 'ย', 'ย — ย ยักษ์ (Demon / Giant)', 1),
    ('ร', 'ร', 'ร — ร เรือ (Boat)', 1),
    ('ล', 'ล', 'ล — ล ลิง (Monkey)', 1),
    ('ว', 'ว', 'ว — ว แหวน (Ring)', 1),
    ('ศ', 'ศ', 'ศ — ศ ศาลา (Gazebo / Pavilion)', 2),
    ('ษ', 'ษ', 'ษ — ษ ฤๅษี (Hermit)', 2),
    ('ส', 'ส', 'ส — ส เสือ (Tiger)', 1),
    ('ห', 'ห', 'ห — ห หีบ (Box / Trunk)', 2),
    ('ฬ', 'ฬ', 'ฬ — ฬ จุฬา (Kite)', 2),
    ('อ', 'อ', 'อ — อ อ่าง (Tub / Bucket)', 1),
    ('ฮ', 'ฮ', 'ฮ — ฮ นกฮูก (Owl)', 2)
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
