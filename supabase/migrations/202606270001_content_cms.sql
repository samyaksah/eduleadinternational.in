begin;

create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = (select auth.uid())
      and active = true
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

create table if not exists public.results (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  designation text,
  school text,
  city text,
  course text not null,
  course_group text not null check (course_group in ('teachingLearning', 'educationalLeadership', 'other')),
  score text,
  photo_url text,
  featured boolean not null default false,
  published boolean not null default false,
  sort_order integer not null default 100,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  description text not null,
  image_url text not null,
  published boolean not null default false,
  sort_order integer not null default 100,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.commencement_dates (
  id uuid primary key default gen_random_uuid(),
  course text not null,
  course_group text not null unique check (course_group in ('teachingLearning', 'educationalLeadership', 'cpdOnline', 'certifiedTraining', 'other')),
  commencement_date date,
  display_date text,
  label text not null default 'New Cohort Commencement Date',
  url text,
  published boolean not null default false,
  sort_order integer not null default 100,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  course_slug text not null default 'general',
  testimonial_type text not null default 'written' check (testimonial_type in ('written', 'video')),
  name text not null,
  designation text,
  school text,
  city text,
  quote text,
  portrait_url text,
  video_url text,
  video_thumbnail_url text,
  featured boolean not null default false,
  published boolean not null default false,
  sort_order integer not null default 100,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists results_public_order_idx
  on public.results (course_group, published, sort_order, name);
create index if not exists gallery_public_order_idx
  on public.gallery_items (published, sort_order);
create index if not exists testimonials_public_order_idx
  on public.testimonials (course_slug, testimonial_type, published, sort_order);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_results_updated_at on public.results;
create trigger set_results_updated_at
before update on public.results
for each row execute function public.set_updated_at();

drop trigger if exists set_gallery_items_updated_at on public.gallery_items;
create trigger set_gallery_items_updated_at
before update on public.gallery_items
for each row execute function public.set_updated_at();

drop trigger if exists set_commencement_dates_updated_at on public.commencement_dates;
create trigger set_commencement_dates_updated_at
before update on public.commencement_dates
for each row execute function public.set_updated_at();

drop trigger if exists set_testimonials_updated_at on public.testimonials;
create trigger set_testimonials_updated_at
before update on public.testimonials
for each row execute function public.set_updated_at();

alter table public.admin_users enable row level security;
alter table public.results enable row level security;
alter table public.gallery_items enable row level security;
alter table public.commencement_dates enable row level security;
alter table public.testimonials enable row level security;

revoke all on public.admin_users from anon, authenticated;
revoke all on public.results from anon, authenticated;
revoke all on public.gallery_items from anon, authenticated;
revoke all on public.commencement_dates from anon, authenticated;
revoke all on public.testimonials from anon, authenticated;

grant select on public.admin_users to authenticated;
grant select on public.results, public.gallery_items, public.commencement_dates, public.testimonials to anon;
grant select, insert, update, delete
  on public.results, public.gallery_items, public.commencement_dates, public.testimonials
  to authenticated;

drop policy if exists "Admins can read their profile" on public.admin_users;
create policy "Admins can read their profile"
on public.admin_users for select
to authenticated
using (user_id = (select auth.uid()) and active = true);

drop policy if exists "Published results are public" on public.results;
create policy "Published results are public"
on public.results for select
to anon, authenticated
using (published = true);

drop policy if exists "Admins manage results" on public.results;
create policy "Admins manage results"
on public.results for all
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

drop policy if exists "Published gallery items are public" on public.gallery_items;
create policy "Published gallery items are public"
on public.gallery_items for select
to anon, authenticated
using (published = true);

drop policy if exists "Admins manage gallery items" on public.gallery_items;
create policy "Admins manage gallery items"
on public.gallery_items for all
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

drop policy if exists "Published commencement dates are public" on public.commencement_dates;
create policy "Published commencement dates are public"
on public.commencement_dates for select
to anon, authenticated
using (published = true);

drop policy if exists "Admins manage commencement dates" on public.commencement_dates;
create policy "Admins manage commencement dates"
on public.commencement_dates for all
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

drop policy if exists "Published testimonials are public" on public.testimonials;
create policy "Published testimonials are public"
on public.testimonials for select
to anon, authenticated
using (published = true);

drop policy if exists "Admins manage testimonials" on public.testimonials;
create policy "Admins manage testimonials"
on public.testimonials for all
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'site-media',
  'site-media',
  true,
  52428800,
  array[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'video/mp4',
    'video/webm',
    'application/pdf'
  ]
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Admins can view site media metadata" on storage.objects;
create policy "Admins can view site media metadata"
on storage.objects for select
to authenticated
using (bucket_id = 'site-media' and (select public.is_admin()));

drop policy if exists "Admins can upload site media" on storage.objects;
create policy "Admins can upload site media"
on storage.objects for insert
to authenticated
with check (bucket_id = 'site-media' and (select public.is_admin()));

drop policy if exists "Admins can update site media" on storage.objects;
create policy "Admins can update site media"
on storage.objects for update
to authenticated
using (bucket_id = 'site-media' and (select public.is_admin()))
with check (bucket_id = 'site-media' and (select public.is_admin()));

drop policy if exists "Admins can delete site media" on storage.objects;
create policy "Admins can delete site media"
on storage.objects for delete
to authenticated
using (bucket_id = 'site-media' and (select public.is_admin()));

commit;
