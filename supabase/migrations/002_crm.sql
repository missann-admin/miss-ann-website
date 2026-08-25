-- Miss Ann CRM — run in the Supabase SQL editor.
--
-- Design note: the public may only ever APPEND to `form_submissions`. The
-- `contacts` table has no anon policies at all, so a visitor can never read,
-- update, or probe it. A SECURITY DEFINER trigger merges each submission into
-- `contacts`, which means the CRM builds itself without ever exposing the
-- contact list. Letting anon upsert `contacts` directly would allow anyone to
-- overwrite records or test whether a given email is already on file.

-- ---------------------------------------------------------------------------
-- Raw intake: append-only, one row per form submission, never edited.
-- ---------------------------------------------------------------------------
create table if not exists form_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  name text,
  email text not null,
  message text,
  interests text[] default '{}',
  email_consent boolean default false,
  -- Attribution: which form, which page, and how they found us.
  form text default 'contact',            -- 'contact' | 'email-signup'
  page_path text,
  referrer text,
  utm_source text,
  utm_medium text,
  utm_campaign text
);

-- ---------------------------------------------------------------------------
-- The CRM: one row per person, deduplicated by email.
-- ---------------------------------------------------------------------------
create table if not exists contacts (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  email text not null unique,
  name text,
  phone text,
  -- Segmentation. Interests accumulate across every submission from this person.
  interests text[] default '{}',
  -- First-touch attribution, kept stable; later touches live in form_submissions.
  first_form text,
  first_referrer text,
  first_utm_source text,
  first_utm_campaign text,
  -- Email marketing permission. Only ever set true by explicit opt-in.
  email_consent boolean default false,
  consent_at timestamptz,
  -- Relationship pipeline, maintained by hand as people are worked.
  stage text default 'new',               -- new | engaged | donor | volunteer | lapsed
  internal_notes text,
  submission_count int default 0,
  first_seen_at timestamptz default now(),
  last_seen_at timestamptz default now()
);

create index if not exists contacts_interests_idx on contacts using gin (interests);
create index if not exists contacts_stage_idx on contacts (stage);
create index if not exists contacts_consent_idx on contacts (email_consent);

-- ---------------------------------------------------------------------------
-- Merge each submission into the contact record.
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
    email_consent, consent_at, submission_count
  )
  values (
    clean_email, clean_name, coalesce(new.interests, '{}'),
    new.form, new.referrer, new.utm_source, new.utm_campaign,
    coalesce(new.email_consent, false),
    case when new.email_consent then now() end,
    1
  )
  on conflict (email) do update set
    -- Keep an existing name rather than blanking it with an empty submission.
    name = coalesce(excluded.name, contacts.name),
    -- Union the interest tags so segments accumulate over time.
    interests = (
      select coalesce(array_agg(distinct i), '{}')
      from unnest(contacts.interests || excluded.interests) as i
    ),
    -- Consent is sticky once given; never silently revoked by a later form.
    email_consent = contacts.email_consent or excluded.email_consent,
    consent_at = coalesce(contacts.consent_at, excluded.consent_at),
    submission_count = contacts.submission_count + 1,
    last_seen_at = now(),
    updated_at = now();

  return new;
end;
$$;

drop trigger if exists trg_merge_submission on form_submissions;
create trigger trg_merge_submission
after insert on form_submissions
for each row execute function merge_submission_into_contact();

-- ---------------------------------------------------------------------------
-- Row level security
-- ---------------------------------------------------------------------------
alter table form_submissions enable row level security;
alter table contacts enable row level security;

drop policy if exists "anon can insert submissions" on form_submissions;
create policy "anon can insert submissions"
  on form_submissions for insert to anon with check (true);

-- `contacts` intentionally has NO anon policies: unreachable from the website.
-- Read it from the Supabase dashboard or with the service role key only.

-- ---------------------------------------------------------------------------
-- Convenience view for pulling marketing lists.
-- ---------------------------------------------------------------------------
-- security_invoker is essential: without it a view runs with its OWNER's
-- privileges and reads straight past row level security on `contacts`,
-- exposing the whole list to the public anon key. See 003 for the incident.
create view mailing_list
  with (security_invoker = true)
as
  select email, name, interests, stage, first_seen_at, last_seen_at
  from contacts
  where email_consent = true
  order by last_seen_at desc;

revoke all on mailing_list from anon, authenticated;
revoke all on contacts from anon, authenticated;
