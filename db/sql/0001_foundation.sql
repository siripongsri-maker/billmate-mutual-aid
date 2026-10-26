-- Foundation for the คนละนิด admin area: roles, settings, audit log.
-- Re-runnable: every statement is safe to run more than once.
--
-- profiles   one row per signed-in person (created automatically at sign-up)
-- settings   site-wide numbers the team can change (read/written only by server functions)
-- audit_log  who did what in the admin area (read/written only by server functions)

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  display_name text check (char_length(display_name) <= 60),
  contact text check (char_length(contact) <= 120),
  role text not null default 'requester' check (role in ('requester', 'admin', 'owner')),
  suspended_until timestamptz,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Create a profile row whenever a new auth user appears.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (user_id, display_name)
  values (
    new.id,
    nullif(left(new.raw_user_meta_data ->> 'name', 60), '')
  )
  on conflict (user_id) do nothing;
  return new;
end;
$$;

revoke all on function public.handle_new_user() from public, anon, authenticated;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Backfill: people who signed up before this migration get a profile row too.
insert into public.profiles (user_id)
select id from auth.users
on conflict (user_id) do nothing;

-- True when the signed-in user is an admin or owner and is not suspended.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    where p.user_id = auth.uid()
      and p.role in ('admin', 'owner')
      and (p.suspended_until is null or p.suspended_until <= now())
  );
$$;

revoke all on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

-- A person can read their own profile and edit only their name and contact.
-- Role and suspension can be changed only by server functions (service role).
drop policy if exists "Read own profile" on public.profiles;
create policy "Read own profile"
  on public.profiles
  for select
  to authenticated
  using (user_id = auth.uid());

drop policy if exists "Update own profile" on public.profiles;
create policy "Update own profile"
  on public.profiles
  for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

revoke all on public.profiles from anon, authenticated;
grant select on public.profiles to authenticated;
grant update (display_name, contact) on public.profiles to authenticated;

-- ---------------------------------------------------------------------------
-- settings
-- ---------------------------------------------------------------------------
create table if not exists public.settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.settings enable row level security;

-- No policies on purpose: only server functions (service role) read or write this.
revoke all on public.settings from anon, authenticated;

insert into public.settings (key, value) values
  ('overdue_limit_days', '30'::jsonb),
  ('receipt_days', '7'::jsonb),
  ('doc_retention_days', '30'::jsonb),
  ('slip_retention_days', '180'::jsonb),
  ('pending_alert_hours', '48'::jsonb)
on conflict (key) do nothing;

-- ---------------------------------------------------------------------------
-- audit_log
-- ---------------------------------------------------------------------------
create table if not exists public.audit_log (
  id bigint generated always as identity primary key,
  actor_id uuid,
  action text not null,
  target_type text,
  target_id text,
  detail jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.audit_log enable row level security;

-- No policies on purpose: only server functions (service role) read or write this.
revoke all on public.audit_log from anon, authenticated;

-- Make the new tables visible to the API right away.
notify pgrst, 'reload schema';
