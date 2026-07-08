create table reflection_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null check (event_type in ('open', 'complete')),
  created_at timestamptz not null default now()
);

alter table reflection_events enable row level security;

create policy "Allow anonymous inserts"
  on reflection_events
  for insert
  to anon
  with check (true);

