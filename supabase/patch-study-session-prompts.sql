-- Prompt history for letters / words / sentences practice sessions.
alter table public.study_sessions
  add column if not exists session_prompts text[] not null default '{}';

create index if not exists study_sessions_deck_completed_idx
  on public.study_sessions (user_id, deck_id, completed_at desc);
