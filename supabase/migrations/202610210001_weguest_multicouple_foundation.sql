-- WeGuest | Foundation multi-couple schema (additive v2)
-- Apply in Supabase SQL Editor only after reviewing the current database.
-- This migration uses wg_* names to avoid colliding with legacy public tables.
-- It does NOT configure payment processing or public RSVP/guestbook writes.

begin;

create extension if not exists pgcrypto;

create table if not exists public.wg_staff_members (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('platform_admin','welucci_ops','finance')),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.wg_couples (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid references auth.users(id) on delete set null,
  slug text not null unique,
  partner_one_name text not null,
  partner_two_name text not null,
  event_date date,
  venue_name text,
  status text not null default 'draft' check (status in ('draft','published','paused','archived')),
  plan text not null default 'standard',
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint wg_couples_slug_format check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$')
);

create index if not exists wg_couples_owner_idx on public.wg_couples(owner_user_id);
create index if not exists wg_couples_status_idx on public.wg_couples(status);

create table if not exists public.wg_site_settings (
  couple_id uuid primary key references public.wg_couples(id) on delete cascade,
  headline text,
  welcome_message text,
  story text,
  theme jsonb not null default '{}'::jsonb,
  sections jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.wg_media (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null references public.wg_couples(id) on delete cascade,
  storage_bucket text not null default 'couple-media',
  storage_path text not null,
  media_type text not null check (media_type in ('image','video')),
  alt_text text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique(storage_bucket, storage_path)
);
create index if not exists wg_media_couple_order_idx on public.wg_media(couple_id, sort_order);

create table if not exists public.wg_guests (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null references public.wg_couples(id) on delete cascade,
  full_name text not null,
  email text,
  phone text,
  rsvp_status text not null default 'pending' check (rsvp_status in ('pending','confirmed','declined')),
  party_size integer not null default 0 check (party_size >= 0 and party_size <= 20),
  dietary_notes text,
  invitation_token_hash text unique,
  responded_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists wg_guests_couple_idx on public.wg_guests(couple_id);
create index if not exists wg_guests_couple_rsvp_idx on public.wg_guests(couple_id, rsvp_status);

create table if not exists public.wg_gifts (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null references public.wg_couples(id) on delete cascade,
  title text not null,
  description text,
  image_path text,
  suggested_amount numeric(12,2) check (suggested_amount is null or suggested_amount >= 0),
  amount numeric(12,2) not null check (amount >= 0),
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists wg_gifts_couple_active_idx on public.wg_gifts(couple_id, active, sort_order);

create table if not exists public.wg_guestbook (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null references public.wg_couples(id) on delete cascade,
  author_name text not null,
  relationship text,
  message text not null check (char_length(message) between 1 and 3000),
  approved boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists wg_guestbook_public_idx on public.wg_guestbook(couple_id, approved, created_at desc);

-- Financial records are written only by trusted server-side integration/webhooks.
create table if not exists public.wg_transactions (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null references public.wg_couples(id) on delete restrict,
  gift_id uuid references public.wg_gifts(id) on delete set null,
  provider text not null,
  provider_payment_id text unique,
  amount_gross numeric(12,2) not null check (amount_gross >= 0),
  platform_fee numeric(12,2) not null default 0 check (platform_fee >= 0),
  gateway_fee numeric(12,2) not null default 0 check (gateway_fee >= 0),
  amount_net numeric(12,2) not null,
  payment_method text,
  payment_status text not null default 'pending' check (payment_status in ('pending','approved','failed','refunded','cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists wg_transactions_couple_date_idx on public.wg_transactions(couple_id, created_at desc);

-- Authorization helper. Staff authorization is kept in a protected table, not user-editable metadata.
create or replace function public.wg_is_staff()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.wg_staff_members s
    where s.user_id = (select auth.uid()) and s.active = true
  );
$$;
revoke all on function public.wg_is_staff() from public;
grant execute on function public.wg_is_staff() to authenticated;

alter table public.wg_staff_members enable row level security;
alter table public.wg_couples enable row level security;
alter table public.wg_site_settings enable row level security;
alter table public.wg_media enable row level security;
alter table public.wg_guests enable row level security;
alter table public.wg_gifts enable row level security;
alter table public.wg_guestbook enable row level security;
alter table public.wg_transactions enable row level security;

drop policy if exists wg_staff_read_self_or_admin on public.wg_staff_members;
create policy wg_staff_read_self_or_admin on public.wg_staff_members
for select to authenticated using (user_id = (select auth.uid()) or (select public.wg_is_staff()));

drop policy if exists wg_couples_read_owner_staff on public.wg_couples;
create policy wg_couples_read_owner_staff on public.wg_couples
for select to authenticated using (owner_user_id = (select auth.uid()) or (select public.wg_is_staff()));

drop policy if exists wg_couples_create_staff on public.wg_couples;
create policy wg_couples_create_staff on public.wg_couples
for insert to authenticated with check ((select public.wg_is_staff()));

drop policy if exists wg_couples_update_owner_staff on public.wg_couples;
create policy wg_couples_update_owner_staff on public.wg_couples
for update to authenticated
using (owner_user_id = (select auth.uid()) or (select public.wg_is_staff()))
with check (owner_user_id = (select auth.uid()) or (select public.wg_is_staff()));

drop policy if exists wg_site_read_owner_staff on public.wg_site_settings;
create policy wg_site_read_owner_staff on public.wg_site_settings
for select to authenticated using (
  exists (select 1 from public.wg_couples c where c.id = couple_id
    and (c.owner_user_id = (select auth.uid()) or (select public.wg_is_staff())))
);
drop policy if exists wg_site_write_owner_staff on public.wg_site_settings;
create policy wg_site_write_owner_staff on public.wg_site_settings
for all to authenticated using (
  exists (select 1 from public.wg_couples c where c.id = couple_id
    and (c.owner_user_id = (select auth.uid()) or (select public.wg_is_staff())))
) with check (
  exists (select 1 from public.wg_couples c where c.id = couple_id
    and (c.owner_user_id = (select auth.uid()) or (select public.wg_is_staff())))
);

drop policy if exists wg_media_owner_staff on public.wg_media;
create policy wg_media_owner_staff on public.wg_media
for all to authenticated using (
  exists (select 1 from public.wg_couples c where c.id = couple_id
    and (c.owner_user_id = (select auth.uid()) or (select public.wg_is_staff())))
) with check (
  exists (select 1 from public.wg_couples c where c.id = couple_id
    and (c.owner_user_id = (select auth.uid()) or (select public.wg_is_staff())))
);

drop policy if exists wg_guests_owner_staff on public.wg_guests;
create policy wg_guests_owner_staff on public.wg_guests
for all to authenticated using (
  exists (select 1 from public.wg_couples c where c.id = couple_id
    and (c.owner_user_id = (select auth.uid()) or (select public.wg_is_staff())))
) with check (
  exists (select 1 from public.wg_couples c where c.id = couple_id
    and (c.owner_user_id = (select auth.uid()) or (select public.wg_is_staff())))
);

drop policy if exists wg_gifts_owner_staff on public.wg_gifts;
create policy wg_gifts_owner_staff on public.wg_gifts
for all to authenticated using (
  exists (select 1 from public.wg_couples c where c.id = couple_id
    and (c.owner_user_id = (select auth.uid()) or (select public.wg_is_staff())))
) with check (
  exists (select 1 from public.wg_couples c where c.id = couple_id
    and (c.owner_user_id = (select auth.uid()) or (select public.wg_is_staff())))
);

drop policy if exists wg_guestbook_owner_staff_read on public.wg_guestbook;
create policy wg_guestbook_owner_staff_read on public.wg_guestbook
for select to authenticated using (
  exists (select 1 from public.wg_couples c where c.id = couple_id
    and (c.owner_user_id = (select auth.uid()) or (select public.wg_is_staff())))
);
drop policy if exists wg_guestbook_owner_staff_moderate on public.wg_guestbook;
create policy wg_guestbook_owner_staff_moderate on public.wg_guestbook
for update to authenticated using (
  exists (select 1 from public.wg_couples c where c.id = couple_id
    and (c.owner_user_id = (select auth.uid()) or (select public.wg_is_staff())))
) with check (
  exists (select 1 from public.wg_couples c where c.id = couple_id
    and (c.owner_user_id = (select auth.uid()) or (select public.wg_is_staff())))
);

drop policy if exists wg_transactions_owner_staff_read on public.wg_transactions;
create policy wg_transactions_owner_staff_read on public.wg_transactions
for select to authenticated using (
  exists (select 1 from public.wg_couples c where c.id = couple_id
    and (c.owner_user_id = (select auth.uid()) or (select public.wg_is_staff())))
);

-- Public content is exposed through a restricted view only. It intentionally omits guest PII,
-- financial details, owner identity, unpublished couples, and private guestbook entries.
create or replace view public.wg_public_sites
with (security_invoker = true)
as
select
  c.id as couple_id,
  c.slug,
  c.partner_one_name,
  c.partner_two_name,
  c.event_date,
  c.venue_name,
  s.headline,
  s.welcome_message,
  s.story,
  s.theme,
  s.sections
from public.wg_couples c
join public.wg_site_settings s on s.couple_id = c.id
where c.status = 'published';

-- Publicly readable, published site content is served via explicit RLS policies.
drop policy if exists wg_couples_public_published on public.wg_couples;
create policy wg_couples_public_published on public.wg_couples
for select to anon, authenticated using (status = 'published');

drop policy if exists wg_site_public_published on public.wg_site_settings;
create policy wg_site_public_published on public.wg_site_settings
for select to anon, authenticated using (
  exists (select 1 from public.wg_couples c where c.id = couple_id and c.status = 'published')
);

drop policy if exists wg_media_public_published on public.wg_media;
create policy wg_media_public_published on public.wg_media
for select to anon, authenticated using (
  exists (select 1 from public.wg_couples c where c.id = couple_id and c.status = 'published')
);

drop policy if exists wg_gifts_public_active_published on public.wg_gifts;
create policy wg_gifts_public_active_published on public.wg_gifts
for select to anon, authenticated using (
  active = true and exists (select 1 from public.wg_couples c where c.id = couple_id and c.status = 'published')
);

drop policy if exists wg_guestbook_public_approved_published on public.wg_guestbook;
create policy wg_guestbook_public_approved_published on public.wg_guestbook
for select to anon, authenticated using (
  approved = true and exists (select 1 from public.wg_couples c where c.id = couple_id and c.status = 'published')
);

grant select on public.wg_public_sites to anon, authenticated;
grant select on public.wg_media, public.wg_gifts, public.wg_guestbook to anon, authenticated;
grant select, insert, update, delete on public.wg_site_settings, public.wg_media, public.wg_guests, public.wg_gifts to authenticated;
grant select, insert, update on public.wg_couples to authenticated;
grant select on public.wg_transactions to authenticated;
grant select on public.wg_staff_members to authenticated;
-- No anon inserts/updates and no client transaction writes. Use validated Edge Functions
-- with rate limiting, captcha/token validation, and payment provider webhook verification.

commit;
