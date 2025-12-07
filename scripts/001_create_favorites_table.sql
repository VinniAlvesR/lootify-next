-- Create favorites table for storing user's favorite games
create table if not exists public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  game_id text not null,
  title text not null,
  thumb text,
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.favorites enable row level security;

-- RLS policies: users can only manage their own favorites
create policy "favorites_select_own"
  on public.favorites for select
  using (auth.uid() = user_id);

create policy "favorites_insert_own"
  on public.favorites for insert
  with check (auth.uid() = user_id);

create policy "favorites_delete_own"
  on public.favorites for delete
  using (auth.uid() = user_id);
