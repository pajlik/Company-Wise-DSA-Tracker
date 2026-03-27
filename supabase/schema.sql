-- Run this in your Supabase SQL editor (project → SQL Editor → New query)

create table if not exists question_tracker (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid references auth.users not null,
  company          text not null,
  question_id      text not null,
  status           text,
  notes            text,
  approach         text,
  time_complexity  text,
  space_complexity text,
  date_solved      text,
  revisions        integer default 0,
  updated_at       timestamptz default now(),
  unique(user_id, company, question_id)
);

-- Row-level security: users can only read/write their own rows
alter table question_tracker enable row level security;

create policy "users own their data"
  on question_tracker
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
