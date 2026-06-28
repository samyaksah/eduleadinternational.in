# Supabase CMS Setup

The public website continues using the existing Google Sheet APIs until
`CONTENT_SOURCE` is explicitly changed to `supabase`.

## 1. Create the database and storage rules

1. Open the Supabase project.
2. Go to **SQL Editor**.
3. Open `supabase/migrations/202606270001_content_cms.sql` from this repository.
4. Paste the complete file into a new query.
5. Select **Run**.

This creates the content tables, private administrator permissions, and the
public `site-media` bucket. Website visitors can view published content and
media, but only approved administrators can upload or change anything.

## 2. Create the first administrator

1. In Supabase, open **Authentication > Users**.
2. Choose **Add user** and create or invite the administrator.
3. Return to **SQL Editor** and run the following after replacing the email:

```sql
insert into public.admin_users (user_id, display_name)
select id, 'Website Administrator'
from auth.users
where email = 'CLIENT_EMAIL_HERE'
on conflict (user_id) do update
set active = true;
```

Do not enable public registration. Add future administrators through
Authentication and then add their user ID to `public.admin_users`.

## 3. Configure Netlify

Open **Project configuration > Environment variables** and add:

| Key | Value |
| --- | --- |
| `SUPABASE_URL` | `https://leinbgraevljyqenaxer.supabase.co` |
| `SUPABASE_PUBLISHABLE_KEY` | The `sb_publishable_...` key |

Do not add a Supabase secret key to browser code or GitHub. This implementation
does not require one.

Leave `CONTENT_SOURCE` unset while content is being prepared. After the website
code is deployed, `/admin` can already connect to Supabase and accept content.

## 4. Test the private dashboard

1. Deploy the updated GitHub branch through Netlify.
2. Visit `https://YOUR-SITE.netlify.app/admin`.
3. Sign in with the administrator account.
4. Add draft records and media.
5. Confirm that draft records do not appear publicly.
6. Publish one record and verify it in the Supabase dashboard.

Use **Import current data** in the Results, Gallery, and Commencement tabs to
copy the existing Google Sheet-backed records into Supabase. The import remains
private until the public source is switched. Testimonials should be added in
the dashboard because the existing testimonials are currently stored directly
in the page HTML.

## 5. Switch the public website

After Results, Gallery, Commencement Dates, and Testimonials have been loaded
and checked, add this Netlify environment variable:

| Key | Value |
| --- | --- |
| `CONTENT_SOURCE` | `supabase` |

Trigger a Netlify deployment. The public API endpoints will then read Supabase:

- `/api/results`
- `/api/gallery`
- `/api/commencements`
- `/api/testimonials`

Removing `CONTENT_SOURCE` or changing it away from `supabase` returns the
existing Results, Gallery, and Commencement APIs to their Google Sheet sources.

## Security checklist

- Keep public sign-up disabled.
- Use a unique password and enable authenticator-app MFA for administrators.
- Never put an `sb_secret_...` or legacy `service_role` key in GitHub.
- Remove administrator access by setting `active = false` in `admin_users`.
- Review Supabase Security Advisor after running the migration.
- Export database content periodically while using the Free plan.
