begin;

create or replace function public.derive_result_course_group()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  normalized_course text;
begin
  if new.course_group is null or btrim(new.course_group) = '' then
    normalized_course := lower(coalesce(new.course, ''));

    if normalized_course like '%teaching%learning%' or normalized_course = 'cidtl' then
      new.course_group := 'teachingLearning';
    elsif normalized_course like '%educational%leadership%' or normalized_course = 'cidel' then
      new.course_group := 'educationalLeadership';
    else
      new.course_group := 'other';
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists derive_result_course_group on public.results;
create trigger derive_result_course_group
before insert or update of course, course_group on public.results
for each row execute function public.derive_result_course_group();

commit;
