-- /filedrop intake — run in the Supabase SQL editor.
--
-- The file drop takes no files: someone describes what they have, a person
-- reads it and replies with a private upload link. So this needs one column
-- for the self-reported kinds of material and nothing else.
--
-- Deliberately NOT changed here:
--   * merge_submission_into_contact() — `materials` belongs on the raw
--     submission, not on `contacts`, so the trigger needs no edit. The
--     migrations restate that function in full, and every restatement risks
--     the donation logic corrected in 004.
--   * the anon insert policy — its `with check` guards amount_cents and
--     payment_event_id because those are forgeable claims about money.
--     `materials` is a self-description with no privileged meaning.
--
-- Submissions arrive with form = 'filedrop' and interests = {memories},
-- which already exists as a contact interest, so contributors land in the
-- right segment with no config change.

alter table form_submissions
  add column if not exists materials text[] default '{}';
