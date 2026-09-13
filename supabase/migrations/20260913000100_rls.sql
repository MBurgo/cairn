-- ============================================================================
-- Cairn — row level security.
--
-- One rule, applied uniformly: you may touch rows belonging to a family you
-- are a member of. Nothing else.
--
-- Family creation goes through public.create_family(), which is SECURITY
-- DEFINER so a brand-new user can create their own family and be recorded as
-- its first parent in one atomic step. There is deliberately no approval
-- gate — a family works the moment it exists.
--
-- Idempotent and transactional.
-- ============================================================================

begin;

-- ---------------------------------------------------------------------------
-- Which families does the current user belong to?
-- SECURITY DEFINER so it can read family_members without tripping that
-- table's own policy and recursing.
-- ---------------------------------------------------------------------------
create or replace function public.user_family_ids()
returns setof uuid
language sql
stable
security definer
set search_path = public
as $$
  select fm.family_id from public.family_members fm where fm.user_id = auth.uid()
$$;

revoke all on function public.user_family_ids() from public;
grant execute on function public.user_family_ids() to authenticated;

-- ---------------------------------------------------------------------------
-- Domain tables: one uniform policy each, for every command.
-- ---------------------------------------------------------------------------
do $$
declare
  t text;
  domain_tables text[] := array['children', 'arc_progress', 'captures', 'prayers', 'blessings'];
begin
  foreach t in array domain_tables loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists %I on public.%I', t || '_own_family', t);
    execute format($f$
      create policy %I on public.%I
        for all to authenticated
        using (family_id in (select public.user_family_ids()))
        with check (family_id in (select public.user_family_ids()))
    $f$, t || '_own_family', t);
  end loop;
end $$;

-- prayer_reviews has no family_id of its own; it inherits through its prayer.
alter table public.prayer_reviews enable row level security;
drop policy if exists prayer_reviews_own_family on public.prayer_reviews;
create policy prayer_reviews_own_family on public.prayer_reviews
  for all to authenticated
  using (
    exists (
      select 1 from public.prayers p
      where p.id = prayer_reviews.prayer_id
        and p.family_id in (select public.user_family_ids())
    )
  )
  with check (
    exists (
      select 1 from public.prayers p
      where p.id = prayer_reviews.prayer_id
        and p.family_id in (select public.user_family_ids())
    )
  );

-- ---------------------------------------------------------------------------
-- families: readable and updatable by its members. Creation goes through
-- create_family() below, so there is no INSERT policy here on purpose.
-- ---------------------------------------------------------------------------
alter table public.families enable row level security;

drop policy if exists families_select_own on public.families;
create policy families_select_own on public.families
  for select to authenticated
  using (id in (select public.user_family_ids()));

drop policy if exists families_update_own on public.families;
create policy families_update_own on public.families
  for update to authenticated
  using (id in (select public.user_family_ids()))
  with check (id in (select public.user_family_ids()));

-- ---------------------------------------------------------------------------
-- family_members: a member may see who else is in their family.
-- Adding members happens through create_family() or an invite flow.
-- ---------------------------------------------------------------------------
alter table public.family_members enable row level security;

drop policy if exists family_members_select_own on public.family_members;
create policy family_members_select_own on public.family_members
  for select to authenticated
  using (family_id in (select public.user_family_ids()));

-- ---------------------------------------------------------------------------
-- Atomic family creation. The caller becomes its first parent.
-- ---------------------------------------------------------------------------
create or replace function public.create_family(p_name text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_family_id uuid;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  if exists (select 1 from public.family_members where user_id = auth.uid()) then
    raise exception 'User already belongs to a family';
  end if;

  if p_name is null or length(trim(p_name)) = 0 then
    raise exception 'Family name is required';
  end if;

  insert into public.families (name) values (trim(p_name)) returning id into v_family_id;
  insert into public.family_members (family_id, user_id, role)
    values (v_family_id, auth.uid(), 'parent');

  return v_family_id;
end;
$$;

revoke all on function public.create_family(text) from public;
grant execute on function public.create_family(text) to authenticated;

commit;
