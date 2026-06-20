-- Run in Supabase SQL Editor to add the Similar letters deck to an existing database.
-- Safe to re-run: uses on conflict / not exists guards.

insert into public.decks (slug, title, description, sort_order)
values
  (
    'similar-letters',
    'Similar letters',
    'Easy-to-confuse letters — choose the right looped form from a small set.',
    2
  )
on conflict (slug) do update set
  title = excluded.title,
  description = excluded.description,
  sort_order = excluded.sort_order;

update public.decks set sort_order = 3 where slug = 'words';
update public.decks set sort_order = 4 where slug = 'sentences';

insert into public.cards (deck_id, type, prompt_text, answer_text, explanation, difficulty)
select d.id, 'letter', v.prompt_text, v.answer_text, v.explanation, v.difficulty
from public.decks d
cross join (
  values
    ('ด', 'ด', 'ด — daaw dèk (Child)', 1),
    ('ต', 'ต', 'ต — dtaaw dtào (Turtle)', 1),
    ('ถ', 'ถ', 'ถ — thǎaw thǔng (Shopping Bag)', 2),
    ('ท', 'ท', 'ท — thaaw thá-hǎan (Soldier)', 1),
    ('ธ', 'ธ', 'ธ — thaaw thong (Flag)', 2),
    ('บ', 'บ', 'บ — baaw bai-máai (Leaf)', 1),
    ('ป', 'ป', 'ป — bpaaw bplaa (Fish)', 1),
    ('พ', 'พ', 'พ — phaaw phaan (Offering Tray)', 1),
    ('ฟ', 'ฟ', 'ฟ — faaw fan (Tooth)', 2),
    ('ผ', 'ผ', 'ผ — phǎaw phûeng (Bee)', 2),
    ('ฝ', 'ฝ', 'ฝ — fǎaw fǎa (Lid)', 2),
    ('ภ', 'ภ', 'ภ — phaaw sǎm phao (Small Chinese Boat)', 2),
    ('ช', 'ช', 'ช — chaaw cháang (Elephant)', 1),
    ('ซ', 'ซ', 'ซ — saaw sôo (chain or shackle (โซ่))', 1),
    ('ศ', 'ศ', 'ศ — sǎaw sǎa-laa (Gazebo / Pavilion)', 2),
    ('ษ', 'ษ', 'ษ — sǎaw ruue-sǐi (Hermit)', 2),
    ('ส', 'ส', 'ส — sǎaw sǔuea (Tiger)', 1),
    ('ข', 'ข', 'ข — khǎaw khài (Egg)', 1),
    ('ค', 'ค', 'ค — khaaw khwaai (Water Buffalo)', 1),
    ('ฆ', 'ฆ', 'ฆ — khaaw rá-khang (Temple Bell)', 2),
    ('ร', 'ร', 'ร — raaw ruuea (Boat)', 1),
    ('ล', 'ล', 'ล — laaw ling (Monkey)', 1),
    ('ว', 'ว', 'ว — waaw wǎaen (Ring)', 1),
    ('น', 'น', 'น — naaw nǔu (Mouse)', 1),
    ('ณ', 'ณ', 'ณ — naaw neen (Buddhist Monk)', 2),
    ('ม', 'ม', 'ม — maaw máa (Horse)', 1),
    ('ฉ', 'ฉ', 'ฉ — chǎaw chìng (Small Cymbal)', 2),
    ('เ', 'เ', 'เ — ee (/ee/ before consonant (sara e))', 1),
    ('แ', 'แ', 'แ — ae (/ae/ before consonant (sara ae))', 1),
    ('า', 'า', 'า — aa (long /aa/ vowel (sara aa))', 1),
    ('ำ', 'ำ', 'ำ — am (/am/ vowel (sara am — as in น้ำ water))', 1),
    ('ิ', 'ิ', 'ิ — i (short /i/ vowel (sara i))', 1),
    ('ี', 'ี', 'ี — ii (long /ii/ vowel (sara ii))', 1),
    ('ึ', 'ึ', 'ึ — ue (short /ue/ vowel (sara ue))', 2),
    ('ื', 'ื', 'ื — uue (long /ue/ vowel (sara uue))', 2),
    ('ุ', 'ุ', 'ุ — u (short /u/ vowel (sara u))', 1),
    ('ู', 'ู', 'ู — uu (long /uu/ vowel (sara uu))', 1),
    ('ใ', 'ใ', 'ใ — ai (/ai/ — only used in 20 common words)', 2),
    ('ไ', 'ไ', 'ไ — ai (/ai/ diphthong (sara ai))', 2)
) as v(prompt_text, answer_text, explanation, difficulty)
where d.slug = 'similar-letters'
  and not exists (
    select 1 from public.cards c
    where c.deck_id = d.id and c.prompt_text = v.prompt_text
  );

-- Match letter names/notes from the Letters deck (same success text as letter picker).
update public.cards sl
set
  explanation = l.explanation,
  difficulty = l.difficulty
from public.cards l
join public.decks sl_deck on sl_deck.slug = 'similar-letters'
join public.decks l_deck on l_deck.slug = 'letters'
where sl.deck_id = sl_deck.id
  and l.deck_id = l_deck.id
  and sl.prompt_text = l.prompt_text
  and sl.answer_text = l.answer_text;
