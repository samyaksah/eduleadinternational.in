const { fetchSupabaseRows, usesSupabaseContent } = require("../lib/supabase");

const CACHE_SECONDS = 60;
const STALE_SECONDS = 60 * 5;

function normalizeRecord(row) {
  const sortOrder = Number.parseInt(row.sort_order, 10);

  return {
    id: row.id,
    courseSlug: String(row.course_slug || "general"),
    type: String(row.testimonial_type || "written"),
    name: String(row.name || "").trim(),
    designation: String(row.designation || "").trim(),
    school: String(row.school || "").trim(),
    city: String(row.city || "").trim(),
    quote: String(row.quote || "").trim(),
    portraitUrl: String(row.portrait_url || "").trim(),
    videoUrl: String(row.video_url || "").trim(),
    videoThumbnailUrl: String(row.video_thumbnail_url || "").trim(),
    featured: Boolean(row.featured),
    published: Boolean(row.published),
    sortOrder: Number.isFinite(sortOrder) ? sortOrder : 9999
  };
}

exports.handler = async function handler() {
  const headers = {
    "Cache-Control": `public, s-maxage=${CACHE_SECONDS}, stale-while-revalidate=${STALE_SECONDS}`,
    "Content-Type": "application/json"
  };

  if (!usesSupabaseContent()) {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ testimonials: [], configured: false, source: "fallback" })
    };
  }

  try {
    const rows = await fetchSupabaseRows(
      "testimonials",
      "?select=*&published=eq.true&order=sort_order.asc,name.asc"
    );
    const testimonials = rows.map(normalizeRecord);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ testimonials, configured: true, source: "supabase" })
    };
  } catch (error) {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        testimonials: [],
        configured: true,
        source: "supabase",
        error: "Testimonials are temporarily unavailable"
      })
    };
  }
};
