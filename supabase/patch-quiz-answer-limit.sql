-- Run once on existing projects that already applied schema.sql without the length check.
alter table public.quiz_attempts
  drop constraint if exists quiz_attempts_selected_answer_check;

alter table public.quiz_attempts
  add constraint quiz_attempts_selected_answer_check
  check (char_length(selected_answer) between 1 and 500);
