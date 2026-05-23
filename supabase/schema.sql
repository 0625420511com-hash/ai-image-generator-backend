-- AI Image Generator — Supabase Schema
-- Run this in Supabase SQL Editor

create table if not exists image_history (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  prompt text not null,
  model text not null,
  aspect_ratio text default '1:1',
  image_url text,
  is_external boolean default false,
  created_at timestamptz default now()
);

-- Enable Row Level Security
alter table image_history enable row level security;

-- Policy: users can only see their own rows
create policy "Users can view own history"
  on image_history for select
  using (auth.uid() = user_id);

-- Policy: users can insert their own rows
create policy "Users can insert own history"
  on image_history for insert
  with check (auth.uid() = user_id);

-- Policy: users can delete their own rows
create policy "Users can delete own history"
  on image_history for delete
  using (auth.uid() = user_id);

-- Index for faster queries
create index if not exists image_history_user_id_idx on image_history(user_id);
create index if not exists image_history_created_at_idx on image_history(created_at desc);
