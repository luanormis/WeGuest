-- WeGuest | media publication hardening
-- Additive migration: preserves existing rows and legacy tables.
begin;

alter table public.wg_media
  add column if not exists is_published boolean not null default false;

alter table public.wg_media
  add column if not exists published_at timestamptz;

alter table public.wg_media
  alter column storage_bucket set default 'weguest-private';

-- Public clients may read only media explicitly published into the public bucket.
drop policy if exists wg_media_public_published on public.wg_media;
create policy wg_media_public_published
on public.wg_media
for select
to anon, authenticated
using (
  is_published = true
  and storage_bucket = 'weguest-public'
  and published_at is not null
  and exists (
    select 1
    from public.wg_couples c
    where c.id = couple_id
      and c.status = 'published'
  )
);

commit;
