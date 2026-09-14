-- ============================================================================
-- Mentors, book chapters, and a blessings table that can hold more than one
-- blessing per son.
--
-- Three things:
--
--   1. Captures gain a chapter. Everything written from today is typed for the
--      part of the book it belongs to — otherwise the generator built in 2033
--      inherits an untyped pile and someone hand-sorts a decade of a family's
--      life.
--
--   2. Mentors. The product's stated fear is that a son won't keep the faith,
--      and the evidence points at non-parent adults invested in the boy. Cairn
--      answered that with one evening. Deliberately NOT a feature: no mentor
--      accounts, no invites, no second user type. A father names the men, and
--      their names are interpolated into items the way his sons' names are.
--      Asking a man to his face is the formative act; an invite email isn't.
--
--   3. blessings.child_id was UNIQUE, so it held exactly one row per son — the
--      rite. Annual birthday blessings need many, so the constraint is
--      replaced with one per son per kind per year.
--
-- Idempotent and transactional.
-- ============================================================================

begin;

-- ---------------------------------------------------------------------------
-- 1. Book chapters
-- ---------------------------------------------------------------------------
alter table public.captures
  add column if not exists chapter text not null default 'the_years';

alter table public.captures drop constraint if exists captures_chapter_known;
alter table public.captures add constraint captures_chapter_known check (
  chapter in (
    'house_sentence',   -- first page
    'groundwork',       -- what I was aiming at, and my own father
    'the_years',        -- the default: captures as they happen
    'birthdays',        -- blessings written for a birthday
    'prayers',          -- reserved; prayers live in their own tables
    'mentor_letter',    -- the men who stood with you
    'handover',
    'sons_letter'       -- last page
  )
);

-- Groundwork writing already recorded predates the column; retype it.
update public.captures
  set chapter = 'groundwork'
  where source_item_id like 'gw-%' and chapter = 'the_years';

create index if not exists captures_chapter_idx
  on public.captures(family_id, chapter, occurred_on desc);

-- ---------------------------------------------------------------------------
-- 2. Mentors
-- ---------------------------------------------------------------------------
create table if not exists public.mentors (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  name text not null check (length(trim(name)) > 0),
  -- Free text on purpose: "uncle", "youth leader", "mate from church".
  relationship text,
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists mentors_family_idx on public.mentors(family_id, created_at);

alter table public.mentors enable row level security;
drop policy if exists mentors_own_family on public.mentors;
create policy mentors_own_family on public.mentors
  for all to authenticated
  using (family_id in (select public.user_family_ids()))
  with check (family_id in (select public.user_family_ids()));

-- ---------------------------------------------------------------------------
-- 3. Blessings: many per son, not one
-- ---------------------------------------------------------------------------
alter table public.blessings
  add column if not exists kind text not null default 'rite'
    check (kind in ('rite', 'birthday'));

alter table public.blessings
  add column if not exists year int;

-- The original UNIQUE on child_id allowed exactly one blessing per boy.
alter table public.blessings drop constraint if exists blessings_child_id_key;

create unique index if not exists blessings_one_per_kind_per_year
  on public.blessings(child_id, kind, coalesce(year, 0));

commit;
