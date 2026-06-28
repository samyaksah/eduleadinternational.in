begin;

create table if not exists public.course_brochures (
  id uuid primary key default gen_random_uuid(),
  course_slug text not null unique check (
    course_slug in ('teaching-learning', 'educational-leadership', 'cpd-online', 'certified-training')
  ),
  title text not null,
  file_url text not null,
  published boolean not null default false,
  sort_order integer not null default 100,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_course_brochures_updated_at on public.course_brochures;
create trigger set_course_brochures_updated_at
before update on public.course_brochures
for each row execute function public.set_updated_at();

alter table public.course_brochures enable row level security;

revoke all on public.course_brochures from anon, authenticated;
grant select on public.course_brochures to anon;
grant select, insert, update, delete on public.course_brochures to authenticated;

drop policy if exists "Published course brochures are public" on public.course_brochures;
create policy "Published course brochures are public"
on public.course_brochures for select
to anon, authenticated
using (published = true);

drop policy if exists "Admins manage course brochures" on public.course_brochures;
create policy "Admins manage course brochures"
on public.course_brochures for all
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

commit;
