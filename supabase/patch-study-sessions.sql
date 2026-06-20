-- Run in Supabase SQL Editor to add practice calendar session logging.

create table if not exists public.study_sessions (
  user_id uuid not null references auth.users (id) on delete cascade,
  session_id uuid not null,
  source text not null check (source in ('practice', 'review')),
  deck_id uuid references public.decks (id) on delete set null,
  card_count int not null check (card_count > 0),
  practiced_on date not null,
  completed_at timestamptz not null default now(),
  primary key (user_id, session_id)
);

create index if not exists study_sessions_user_practiced_idx
  on public.study_sessions (user_id, practiced_on desc);

alter table public.study_sessions enable row level security;

create policy "Users can view own study sessions"
  on public.study_sessions for select using (auth.uid() = user_id);

create policy "Users can insert own study sessions"
  on public.study_sessions for insert with check (auth.uid() = user_id);
