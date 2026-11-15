-- Run AFTER schema.sql. Replace the email below with the email you used
-- when creating your login under Authentication → Users.
-- Run in the Supabase SQL editor, never in the browser app.
do $$
declare
  owner_email text := 'ht.tarikhasic@gmail.com';
  owner_uuid uuid;
begin
  select id into owner_uuid from auth.users where lower(email) = lower(owner_email);
  if owner_uuid is null then
    raise exception 'No login found for %. Create it under Authentication → Users first.', owner_email;
  end if;
  if exists (select 1 from public.app_owner where id <> owner_uuid) then
    raise exception 'A different owner is already configured.';
  end if;
  insert into public.app_owner(id) values (owner_uuid) on conflict do nothing;
end $$;
