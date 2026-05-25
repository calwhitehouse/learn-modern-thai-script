-- Run after schema.sql in Supabase SQL Editor

insert into public.decks (slug, title, description, sort_order)
values
  ('letters', 'Letters', 'Consonants, vowels, and tone marks — match modern to looped forms', 1),
  ('words', 'Words', 'High-frequency vocabulary', 2),
  ('sentences', 'Sentences', 'Short everyday sentences', 3)
on conflict (slug) do update set
  title = excluded.title,
  description = excluded.description,
  sort_order = excluded.sort_order;

-- All letter-deck cards (68: consonants + rare letters + vowels + tone marks)
insert into public.cards (deck_id, type, prompt_text, answer_text, explanation, difficulty)
select d.id, 'letter', v.prompt_text, v.answer_text, v.explanation, v.difficulty
from public.decks d
cross join (
  values
    ('ก', 'ก', 'ก — gaaw gài (Chicken)', 1),
    ('ข', 'ข', 'ข — khǎaw khài (Egg)', 1),
    ('ฃ', 'ฃ', 'ฃ — khǎaw khùuat (Bottle)', 2),
    ('ค', 'ค', 'ค — khaaw khwaai (Water Buffalo)', 1),
    ('ฅ', 'ฅ', 'ฅ — khaaw khon (Person)', 2),
    ('ฆ', 'ฆ', 'ฆ — khaaw rá-khang (Temple Bell)', 2),
    ('ง', 'ง', 'ง — ngaaw nguu (Snake)', 1),
    ('จ', 'จ', 'จ — jaaw jaan (Plate)', 1),
    ('ฉ', 'ฉ', 'ฉ — chǎaw chìng (Small Cymbal)', 2),
    ('ช', 'ช', 'ช — chaaw cháang (Elephant)', 1),
    ('ซ', 'ซ', 'ซ — saaw sôo (Chain for Animals)', 1),
    ('ฌ', 'ฌ', 'ฌ — chaaw chuuhr (Small Tree)', 2),
    ('ญ', 'ญ', 'ญ — yaaw yǐng (Woman)', 2),
    ('ฎ', 'ฎ', 'ฎ — daaw chá-daa (Dance Hat)', 2),
    ('ฏ', 'ฏ', 'ฏ — dtaaw bpà-dtàk (Harpoon)', 2),
    ('ฐ', 'ฐ', 'ฐ — thǎaw thǎan (Pedestal)', 2),
    ('ฑ', 'ฑ', 'ฑ — thaaw mon-thoo (Ramayana Character)', 2),
    ('ฒ', 'ฒ', 'ฒ — thaaw phûu-thâo (Old Man)', 2),
    ('ณ', 'ณ', 'ณ — naaw neen (Buddhist Monk)', 2),
    ('ด', 'ด', 'ด — daaw dèk (Child)', 1),
    ('ต', 'ต', 'ต — dtaaw dtào (Turtle)', 1),
    ('ถ', 'ถ', 'ถ — thǎaw thǔng (Shopping Bag)', 2),
    ('ท', 'ท', 'ท — thaaw thá-hǎan (Soldier)', 1),
    ('ธ', 'ธ', 'ธ — thaaw thong (Flag)', 2),
    ('น', 'น', 'น — naaw nǔu (Mouse)', 1),
    ('บ', 'บ', 'บ — baaw bai-máai (Leaf)', 1),
    ('ป', 'ป', 'ป — bpaaw bplaa (Fish)', 1),
    ('ผ', 'ผ', 'ผ — phǎaw phûeng (Bee)', 2),
    ('ฝ', 'ฝ', 'ฝ — fǎaw fǎa (Lid)', 2),
    ('พ', 'พ', 'พ — phaaw phaan (Offering Tray)', 1),
    ('ฟ', 'ฟ', 'ฟ — faaw fan (Tooth)', 2),
    ('ภ', 'ภ', 'ภ — phaaw sǎm phao (Small Chinese Boat)', 2),
    ('ม', 'ม', 'ม — maaw máa (Horse)', 1),
    ('ย', 'ย', 'ย — yaaw yák (Demon / Giant)', 1),
    ('ร', 'ร', 'ร — raaw ruuea (Boat)', 1),
    ('ล', 'ล', 'ล — laaw ling (Monkey)', 1),
    ('ว', 'ว', 'ว — waaw wǎaen (Ring)', 1),
    ('ศ', 'ศ', 'ศ — sǎaw sǎa-laa (Gazebo / Pavilion)', 2),
    ('ษ', 'ษ', 'ษ — sǎaw ruue-sǐi (Hermit)', 2),
    ('ส', 'ส', 'ส — sǎaw sǔuea (Tiger)', 1),
    ('ห', 'ห', 'ห — hǎaw hìip (Box / Trunk)', 2),
    ('ฬ', 'ฬ', 'ฬ — laaw jù-laa (Kite)', 2),
    ('อ', 'อ', 'อ — aaw àang (Tub / Bucket)', 1),
    ('ฮ', 'ฮ', 'ฮ — haaw nók-hûuk (Owl)', 2),
    ('ฤ', 'ฤ', 'ฤ — rue / ri (season)', 2),
    ('ฦ', 'ฦ', 'ฦ — lue (rare/obsolete usage)', 2),
    ('่', '่', '่ — mai ek (low tone mark)', 2),
    ('้', '้', '้ — mai tho (falling tone mark)', 2),
    ('๊', '๊', '๊ — mai tri (high tone mark)', 2),
    ('๋', '๋', '๋ — mai chattawa (rising tone mark)', 2),
    ('็', '็', '็ — mai taikhu (short vowel mark)', 2),
    ('์', '์', '์ — thanthakhat (silent final consonant)', 2),
    ('ํ', 'ํ', 'ํ — nikhahit (nasal vowel mark (with ำ))', 2),
    ('ะ', 'ะ', 'ะ — sara a (short a vowel)', 1),
    ('ั', 'ั', 'ั — sara a (upper) (short a before consonant)', 2),
    ('า', 'า', 'า — sara aa (long a vowel)', 1),
    ('ำ', 'ำ', 'ำ — sara am (am vowel)', 1),
    ('ิ', 'ิ', 'ิ — sara i (short i vowel)', 1),
    ('ี', 'ี', 'ี — sara ii (long i vowel)', 1),
    ('ึ', 'ึ', 'ึ — sara ue (short ue vowel)', 2),
    ('ื', 'ื', 'ื — sara uue (long ue vowel)', 2),
    ('ุ', 'ุ', 'ุ — sara u (short u vowel)', 1),
    ('ู', 'ู', 'ู — sara uu (long u vowel)', 1),
    ('เ', 'เ', 'เ — sara e (leading e vowel)', 1),
    ('แ', 'แ', 'แ — sara ae (leading ae vowel)', 1),
    ('โ', 'โ', 'โ — sara o (leading o vowel)', 1),
    ('ใ', 'ใ', 'ใ — sara ai mai muan (ai vowel (ใ))', 2),
    ('ไ', 'ไ', 'ไ — sara ai mai malai (ai vowel (ไ))', 2)
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
