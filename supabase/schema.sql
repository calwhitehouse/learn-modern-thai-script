-- Thai Font Trainer — run in Supabase SQL Editor

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now()
);

create table public.decks (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text,
  sort_order int not null default 0
);

create table public.cards (
  id uuid primary key default gen_random_uuid(),
  deck_id uuid not null references public.decks (id) on delete cascade,
  type text not null check (type in ('letter', 'word', 'sentence')),
  prompt_text text not null,
  answer_text text not null,
  explanation text not null default '',
  difficulty int not null default 1 check (difficulty between 1 and 5),
  is_active boolean not null default true,
  similar_set_id text
);

create unique index cards_similar_drill_uniq
  on public.cards (deck_id, similar_set_id, answer_text)
  where similar_set_id is not null;

create table public.user_card_progress (
  user_id uuid not null references auth.users (id) on delete cascade,
  card_id uuid not null references public.cards (id) on delete cascade,
  correct_count int not null default 0,
  incorrect_count int not null default 0,
  current_streak int not null default 0,
  interval_days int not null default 0,
  next_review_at timestamptz,
  mastered_at timestamptz,
  primary key (user_id, card_id)
);

create table public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  card_id uuid not null references public.cards (id) on delete cascade,
  deck_id uuid not null references public.decks (id) on delete cascade,
  was_correct boolean not null,
  selected_answer text not null check (char_length(selected_answer) between 1 and 500),
  session_id uuid not null,
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

create index cards_deck_difficulty_idx on public.cards (deck_id, difficulty) where is_active = true;
create index user_card_progress_review_idx on public.user_card_progress (user_id, next_review_at) where mastered_at is null;
create index quiz_attempts_user_created_idx on public.quiz_attempts (user_id, created_at desc);

create table public.study_sessions (
  user_id uuid not null references auth.users (id) on delete cascade,
  session_id uuid not null,
  source text not null check (source in ('practice', 'review')),
  deck_id uuid references public.decks (id) on delete set null,
  card_count int not null check (card_count > 0),
  practiced_on date not null,
  completed_at timestamptz not null default now(),
  /** Similar-letters drill sets shown this session (empty for other decks). */
  drill_set_ids text[] not null default '{}',
  /** Prompt texts shown this session — letters, words, sentences practice. */
  session_prompts text[] not null default '{}',
  primary key (user_id, session_id)
);

create index study_sessions_user_practiced_idx on public.study_sessions (user_id, practiced_on desc);
create index study_sessions_user_completed_idx on public.study_sessions (user_id, completed_at desc);
create index study_sessions_deck_completed_idx on public.study_sessions (user_id, deck_id, completed_at desc);

alter table public.profiles enable row level security;
alter table public.decks enable row level security;
alter table public.cards enable row level security;
alter table public.user_card_progress enable row level security;
alter table public.quiz_attempts enable row level security;
alter table public.study_sessions enable row level security;

create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Authenticated users can read decks" on public.decks for select to authenticated using (true);
create policy "Authenticated users can read cards" on public.cards for select to authenticated using (true);
create policy "Users can view own progress" on public.user_card_progress for select using (auth.uid() = user_id);
create policy "Users can insert own progress" on public.user_card_progress for insert with check (auth.uid() = user_id);
create policy "Users can update own progress" on public.user_card_progress for update using (auth.uid() = user_id);
create policy "Users can view own attempts" on public.quiz_attempts for select using (auth.uid() = user_id);
create policy "Users can insert own attempts" on public.quiz_attempts for insert with check (auth.uid() = user_id);
create policy "Users can view own study sessions" on public.study_sessions for select using (auth.uid() = user_id);
create policy "Users can insert own study sessions" on public.study_sessions for insert with check (auth.uid() = user_id);
