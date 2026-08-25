-- SECURITY FIX — run in the Supabase SQL editor immediately.
--
-- Problem: `mailing_list` (from 002_crm.sql) was readable by the anon role,
-- exposing every consented contact's email, name, and interests. The anon key
-- is embedded in the public JavaScript bundle by design, so anyone viewing
-- source could have queried the whole list.
--
-- Cause: a Postgres view runs with its OWNER's privileges by default, which
-- bypasses row level security on the underlying table. RLS on `contacts` was
-- correct; the view simply read straight past it.
--
-- Fix: recreate with security_invoker so the CALLER's permissions apply (anon
-- has no SELECT policy on `contacts`, so it sees nothing), and additionally
-- revoke the API roles' access outright as a second layer.

drop view if exists mailing_list;

create view mailing_list
  with (security_invoker = true)
as
  select email, name, interests, stage, first_seen_at, last_seen_at
  from contacts
  where email_consent = true
  order by last_seen_at desc;

-- Defence in depth: even if security_invoker were lost in a future edit, the
-- web-facing roles still hold no privilege on this view.
revoke all on mailing_list from anon, authenticated;

-- Same treatment for the underlying table. RLS with no anon policy already
-- denies access; this removes the grant as well.
revoke all on contacts from anon, authenticated;

-- Verify after running. Both should return zero rows for the anon role:
--   select * from mailing_list;
--   select * from contacts;
