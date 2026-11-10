-- Keepalive heartbeat — run in the Supabase SQL editor.
--
-- Free-tier projects are paused after a week of "too little database
-- activity". The original keepalive (.github/workflows/supabase-keepalive.yml)
-- made one read a day, and RLS returns zero rows to it. It passed every day
-- from 2026-10-03, yet Supabase still warned in November that the project
-- was about to be paused: a single empty read evidently doesn't register as
-- enough activity.
--
-- This gives the keepalive a real write to make. keepalive_ping() updates a
-- single row, so it is unambiguous database activity, and the table can
-- never grow past one row however often it is called.
--
-- The function is callable with the publishable (anon) key so the workflow
-- needs no secret. The worst anyone can do with it is bump a counter and a
-- timestamp; the table itself is not readable or writable by anon.

create table if not exists keepalive (
  id int primary key default 1 check (id = 1),
  pinged_at timestamptz not null default now(),
  ping_count bigint not null default 0
);

alter table keepalive enable row level security;
revoke all on keepalive from anon, authenticated;

create or replace function public.keepalive_ping()
returns timestamptz
language sql
security definer
set search_path = public
as $$
  insert into keepalive (id, pinged_at, ping_count)
  values (1, now(), 1)
  on conflict (id) do update
    set pinged_at = now(),
        ping_count = keepalive.ping_count + 1
  returning pinged_at;
$$;

revoke all on function public.keepalive_ping() from public;
grant execute on function public.keepalive_ping() to anon;

-- Verify after running (should return the current timestamp):
--   select public.keepalive_ping();
