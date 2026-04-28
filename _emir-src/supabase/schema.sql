-- Emir’s Car World browser persistence schema.
-- Run this inside the Supabase SQL editor.

create table if not exists public.garage_state (
  user_id uuid primary key references auth.users(id) on delete cascade,
  selected_vehicle text not null default 'sedan',
  unlocked_vehicles text[] not null default array['sedan']::text[],
  high_score integer not null default 0,
  odometer_meters numeric not null default 0,
  preferences jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.garage_state enable row level security;

create policy "Garage rows are readable by owner"
  on public.garage_state for select
  using (auth.uid() = user_id);

create policy "Garage rows are insertable by owner"
  on public.garage_state for insert
  with check (auth.uid() = user_id);

create policy "Garage rows are updatable by owner"
  on public.garage_state for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists garage_state_set_updated_at on public.garage_state;
create trigger garage_state_set_updated_at
before update on public.garage_state
for each row execute function public.set_updated_at();
