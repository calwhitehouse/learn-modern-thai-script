-- Add drill-set history to study sessions (run once on existing databases).
alter table public.study_sessions
  add column if not exists drill_set_ids text[] not null default '{}';

create index if not exists study_sessions_user_completed_idx
  on public.study_sessions (user_id, completed_at desc);
