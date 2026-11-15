-- Run once in the Supabase SQL editor after creating the owner in Authentication.
create table public.app_owner (id uuid primary key references auth.users(id));
alter table public.app_owner enable row level security;
-- No browser policies: only administrators can configure the owner.
create table public.sets (
 id uuid primary key,
 owner_id uuid not null references auth.users(id),
 exercise text not null check(length(trim(exercise)) between 1 and 80),
 date date not null,
 weight numeric not null check(weight >= 0 and weight < 100000),
 unit text not null check(unit in ('lb','kg')),
 reps integer not null check(reps > 0 and reps < 100000),
 note text not null default '',
 created_at timestamptz not null default now()
);
create index sets_owner_date on public.sets(owner_id,date);
create function public.is_app_owner() returns boolean language sql stable security definer set search_path = '' as $$
 select exists(select 1 from public.app_owner where id = auth.uid());
$$;
revoke all on function public.is_app_owner() from public;
grant execute on function public.is_app_owner() to authenticated;
alter table public.sets enable row level security;
create policy owner_only on public.sets for all to authenticated
 using (owner_id = (select auth.uid()) and (select public.is_app_owner()))
 with check (owner_id = (select auth.uid()) and (select public.is_app_owner()));
-- Replace with the Authentication user UUID, then run separately:
-- insert into public.app_owner(id) values ('YOUR-OWNER-USER-UUID');
