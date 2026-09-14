-- ============================================================================
-- Groundwork, deferral, and the writing a father does before he starts.
--
-- Three things this adds:
--
--   1. Groundwork — the first four weeks belong to the father, not his sons.
--      Completions are recorded in arc_progress with a null child_id, which
--      the existing shared-item unique index already handles.
--
--   2. Deferral. Until now the only options were done or ignore, which meant
--      a father whose son wasn't ready had to either lie or do nothing. A
--      lie here ends up printed in the book at eighteen.
--
--   3. Captures gain a source, so the paragraphs written during groundwork
--      can be found again when the book is generated.
--
-- Idempotent and transactional.
-- ============================================================================

begin;

-- Which day of the week to ask. 0 = Sunday, matching JS getDay().
alter table public.families
  add column if not exists reminder_day smallint not null default 0
    check (reminder_day between 0 and 6);

-- Set when a father deliberately skips the groundwork weeks.
alter table public.families
  add column if not exists groundwork_skipped_at timestamptz;

-- A progress row is now either a completion or a deferral.
alter table public.arc_progress
  add column if not exists status text not null default 'done'
    check (status in ('done', 'deferred'));

alter table public.arc_progress
  add column if not exists deferred_until date;

-- A deferral must say until when; a completion must not.
alter table public.arc_progress
  drop constraint if exists arc_progress_deferral_has_date;
alter table public.arc_progress
  add constraint arc_progress_deferral_has_date check (
    (status = 'deferred' and deferred_until is not null) or
    (status = 'done' and deferred_until is null)
  );

create index if not exists arc_progress_deferred_idx
  on public.arc_progress(family_id, deferred_until) where status = 'deferred';

-- Where a capture came from, so groundwork writing can be found later.
alter table public.captures
  add column if not exists source_item_id text;

create index if not exists captures_source_idx
  on public.captures(family_id, source_item_id) where source_item_id is not null;

commit;
