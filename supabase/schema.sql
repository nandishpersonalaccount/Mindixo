-- ==============================================================================
-- MINDIXO — Supabase Complete Setup Schema
-- Run this entire script in Supabase SQL Editor (Dashboard -> SQL Editor -> New query)
-- ==============================================================================

-- 1. Enable pgcrypto extension for UUID generation
create extension if not exists "pgcrypto";

-- 2. Create custom role enum
do $$ begin
  create type public.app_role as enum ('admin');
exception
  when duplicate_object then null;
end $$;

-- 3. Create user_roles table
create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role public.app_role not null,
  unique(user_id, role)
);

grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

-- Function to check admin status securely
create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists(
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  )
$$;

revoke execute on function public.has_role(uuid, public.app_role) from public, anon;
grant execute on function public.has_role(uuid, public.app_role) to authenticated, service_role;

-- Policy: users can view their own roles
drop policy if exists own_roles on public.user_roles;
create policy own_roles on public.user_roles
  for select to authenticated
  using (user_id = auth.uid());

-- 4. Create categories table
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text not null default '',
  position integer not null default 0
);

grant select on public.categories to anon;
grant select, insert, update, delete on public.categories to authenticated;
grant all on public.categories to service_role;
alter table public.categories enable row level security;

drop policy if exists category_read on public.categories;
create policy category_read on public.categories
  for select using (true);

drop policy if exists category_admin on public.categories;
create policy category_admin on public.categories
  for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- 5. Create products table
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  author text not null,
  cover text not null default '',
  price numeric(10, 2) not null check (price >= 0),
  category_id uuid references public.categories(id) on delete set null,
  description text not null default '',
  sample text not null default '',
  formats text[] not null default '{PDF}',
  pages integer not null default 0 check (pages >= 0),
  published boolean not null default false,
  created_at timestamptz not null default now()
);

grant select on public.products to anon;
grant select, insert, update, delete on public.products to authenticated;
grant all on public.products to service_role;
alter table public.products enable row level security;

drop policy if exists public_products on public.products;
create policy public_products on public.products
  for select using (published);

drop policy if exists admin_products on public.products;
create policy admin_products on public.products
  for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- 6. Create product_files table (for downloadable ebooks)
create table if not exists public.product_files (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  path text not null,
  filename text not null
);

grant select, insert, update, delete on public.product_files to authenticated;
grant all on public.product_files to service_role;
alter table public.product_files enable row level security;

drop policy if exists admin_files on public.product_files;
create policy admin_files on public.product_files
  for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- 7. Create store_settings table
create table if not exists public.store_settings (
  id integer primary key check (id = 1),
  announcement text not null default '',
  intro text not null default '',
  email text not null default '',
  phone text not null default '',
  address text not null default '',
  about text not null default '',
  privacy text not null default '',
  terms text not null default '',
  refund text not null default '',
  cookies text not null default '',
  dmca text not null default '',
  delivery text not null default ''
);

grant select on public.store_settings to anon;
grant select, insert, update, delete on public.store_settings to authenticated;
grant all on public.store_settings to service_role;
alter table public.store_settings enable row level security;

drop policy if exists settings_read on public.store_settings;
create policy settings_read on public.store_settings
  for select using (true);

drop policy if exists settings_admin on public.store_settings;
create policy settings_admin on public.store_settings
  for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- Ensure row 1 exists in store_settings
insert into public.store_settings (id, intro, announcement)
values (1, 'A little less noise. A little more reading.', '')
on conflict (id) do nothing;

-- 8. Storage Buckets Setup
insert into storage.buckets (id, name, public)
values ('store-covers', 'store-covers', true)
on conflict (id) do update set public = true;

insert into storage.buckets (id, name, public)
values ('ebook-files', 'ebook-files', false)
on conflict (id) do update set public = false;

-- Storage Policies
drop policy if exists cover_read on storage.objects;
create policy cover_read on storage.objects
  for select using (bucket_id = 'store-covers');

drop policy if exists admin_storage on storage.objects;
create policy admin_storage on storage.objects
  for all to authenticated
  using (bucket_id in ('store-covers', 'ebook-files') and public.has_role(auth.uid(), 'admin'))
  with check (bucket_id in ('store-covers', 'ebook-files') and public.has_role(auth.uid(), 'admin'));

-- ==============================================================================
-- SEED DATA (Optional Starter Categories)
-- ==============================================================================
insert into public.categories (name, description, position)
values
  ('Psychology', 'Books exploring human behavior, cognition, and mindsets.', 1),
  ('Manifestation', 'Guides and literature on visualization and intent.', 2),
  ('Finance', 'Personal wealth, economics, and business insights.', 3),
  ('Philosophy', 'Reflections on life, purpose, and existence.', 4)
on conflict (name) do nothing;

-- ==============================================================================
-- HOW TO PROMOTE YOURSELF TO ADMIN:
-- 1. Sign up on your website at /auth (or via Supabase Authentication -> Users)
-- 2. Find your User UID in Supabase Dashboard -> Authentication -> Users
-- 3. Run:
--    insert into public.user_roles (user_id, role)
--    values ('YOUR-USER-UUID-HERE', 'admin')
--    on conflict do nothing;
-- ==============================================================================
