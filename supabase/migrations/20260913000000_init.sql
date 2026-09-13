-- ============================================================================
-- Cairn — initial schema.
--
-- Design notes that matter:
--   * A family is the tenant, not a user. Both parents share one family.
--   * There is NO approval gate. A family is usable the moment it is created.
--     (readyforsunday shipped an `approved` flag that had to be flipped by
--     hand, and that single column is why it never onboarded a stranger.)
--   * Arc items live in the app as content, not in the database. Progress
--     rows reference a stable text item_id so content can be edited freely.
--   * A shared item is completed once for the family (child_id is null); an
--     individual item is completed per boy.
--
-- Idempotent and transactional.
-- ============================================================================

begin;

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Tenancy
-- ---------------------------------------------------------------------------
create table if not exists public.families (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.family_members (
  family_id uuid not null references public.families(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'parent' check (role in ('parent', 'guardian')),
  created_at timestamptz not null default now(),
  primary key (family_id, user_id)
);

create index if not exists family_members_user_idx on public.family_members(user_id);

create table if not exists public.children (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  name text not null,
  birthdate date not null,
  created_at timestamptz not null default now(),
  constraint children_birthdate_sane check (birthdate > '1900-01-01' and birthdate <= current_date)
);

create index if not exists children_family_idx on public.children(family_id);

-- ---------------------------------------------------------------------------
-- The Arc
-- ---------------------------------------------------------------------------
create table if not exists public.arc_progress (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  -- null means a shared item, completed once for the whole family.
  child_id uuid references public.children(id) on delete cascade,
  item_id text not null,
  completed_on date not null default current_date,
  note text,
  created_at timestamptz not null default now()
);

-- One completion per item per boy, and one per family for shared items.
create unique index if not exists arc_progress_individual_uniq
  on public.arc_progress(child_id, item_id) where child_id is not null;
create unique index if not exists arc_progress_shared_uniq
  on public.arc_progress(family_id, item_id) where child_id is null;

-- ---------------------------------------------------------------------------
-- Captures — the raw material of the book
-- ---------------------------------------------------------------------------
create table if not exists public.captures (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  -- null means it belongs to the whole family rather than one son.
  child_id uuid references public.children(id) on delete cascade,
  body text not null check (length(trim(body)) > 0),
  occurred_on date not null default current_date,
  created_at timestamptz not null default now()
);

create index if not exists captures_family_idx on public.captures(family_id, occurred_on desc);
create index if not exists captures_child_idx on public.captures(child_id, occurred_on desc);

-- ---------------------------------------------------------------------------
-- Prayers, and the review loop that makes them worth keeping
-- ---------------------------------------------------------------------------
create table if not exists public.prayers (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  child_id uuid not null references public.children(id) on delete cascade,
  body text not null check (length(trim(body)) > 0),
  scripture_ref text,
  logged_on date not null default current_date,
  -- The whole point: it comes back and asks what happened.
  next_review_on date not null,
  status text not null default 'waiting'
    check (status in ('waiting', 'answered', 'changed', 'closed')),
  created_at timestamptz not null default now()
);

create index if not exists prayers_review_idx
  on public.prayers(family_id, next_review_on) where status = 'waiting';
create index if not exists prayers_child_idx on public.prayers(child_id, logged_on desc);

create table if not exists public.prayer_reviews (
  id uuid primary key default gen_random_uuid(),
  prayer_id uuid not null references public.prayers(id) on delete cascade,
  reviewed_on date not null default current_date,
  outcome text not null check (outcome in ('answered', 'changed', 'waiting')),
  note text,
  created_at timestamptz not null default now()
);

create index if not exists prayer_reviews_prayer_idx
  on public.prayer_reviews(prayer_id, reviewed_on desc);

-- ---------------------------------------------------------------------------
-- The blessing: a chosen birthday, announced a year out
-- ---------------------------------------------------------------------------
create table if not exists public.blessings (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  child_id uuid not null unique references public.children(id) on delete cascade,
  -- Which birthday: 12, 13 or 14 (or later, for a father starting late).
  chosen_age int not null check (chosen_age between 10 and 19),
  planned_date date not null,
  told_him boolean not null default false,
  status text not null default 'planned' check (status in ('planned', 'done')),
  created_at timestamptz not null default now()
);

commit;
