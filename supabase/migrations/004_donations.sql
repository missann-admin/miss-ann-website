-- Donation tracking — run in the Supabase SQL editor.
--
-- Donations come in through the paypal-ipn Edge Function using the service
-- role key, which bypasses RLS entirely — never through the anon key. The
-- anon insert policy is tightened below so a visitor can never set
-- amount_cents/payment_event_id themselves and fake a donation record.

alter table form_submissions
  add column if not exists amount_cents integer,
  add column if not exists payment_event_id text;

-- The payment processor (PayPal today) can redeliver the same notification;
-- this makes re-inserting it a no-op instead of double-counting the donation.
create unique index if not exists form_submissions_payment_event_id_idx
  on form_submissions (payment_event_id)
  where payment_event_id is not null;

alter table contacts
  add column if not exists total_donated_cents integer default 0,
  add column if not exists last_donated_at timestamptz;

-- ---------------------------------------------------------------------------
-- Extend the merge trigger: a donation rolls into total_donated_cents and
-- promotes the contact to stage 'donor'. Everything else is unchanged from
-- 002_crm.sql.
-- ---------------------------------------------------------------------------
create or replace function public.merge_submission_into_contact()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  clean_email text := lower(trim(new.email));
  clean_name  text := nullif(trim(coalesce(new.name, '')), '');
begin
  insert into contacts (
    email, name, interests, first_form, first_referrer,
    first_utm_source, first_utm_campaign,
    email_consent, consent_at, submission_count,
    total_donated_cents, last_donated_at, stage
  )
  values (
    clean_email, clean_name, coalesce(new.interests, '{}'),
    new.form, new.referrer, new.utm_source, new.utm_campaign,
    coalesce(new.email_consent, false),
    case when new.email_consent then now() end,
    1,
    coalesce(new.amount_cents, 0),
    case when new.amount_cents is not null then now() end,
    -- Someone whose very first contact with us is a donation is a donor, not
    -- a 'new' lead; without this they'd fall through to the column default
    -- and be missed by every "where stage = 'donor'" query.
    case when coalesce(new.amount_cents, 0) > 0 then 'donor' else 'new' end
  )
  on conflict (email) do update set
    name = coalesce(excluded.name, contacts.name),
    interests = (
      select coalesce(array_agg(distinct i), '{}')
      from unnest(contacts.interests || excluded.interests) as i
    ),
    email_consent = contacts.email_consent or excluded.email_consent,
    consent_at = coalesce(contacts.consent_at, excluded.consent_at),
    submission_count = contacts.submission_count + 1,
    total_donated_cents = contacts.total_donated_cents + excluded.total_donated_cents,
    last_donated_at = coalesce(excluded.last_donated_at, contacts.last_donated_at),
    -- Donor outranks the default pipeline; never downgrades someone already there.
    stage = case when excluded.total_donated_cents > 0 then 'donor' else contacts.stage end,
    last_seen_at = now(),
    updated_at = now();

  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Anon may still only append a submission, and now may never set the
-- donation fields — those are only ever written by the paypal-ipn function
-- using the service role key, which bypasses this policy entirely.
-- ---------------------------------------------------------------------------
drop policy if exists "anon can insert submissions" on form_submissions;
create policy "anon can insert submissions"
  on form_submissions for insert to anon
  with check (amount_cents is null and payment_event_id is null);

-- Verify after running (as the anon role, e.g. via curl with the publishable
-- key): an insert with amount_cents set should be rejected (401/403), and a
-- normal contact-form insert should still succeed (201).
