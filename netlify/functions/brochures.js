const { fetchSupabaseRows, usesSupabaseContent } = require("../lib/supabase");

const CACHE_SECONDS = 60 * 5;
const STALE_SECONDS = 60 * 30;

function normalizeRecord(row) {
  return {
    id: row.id,
    courseSlug: String(row.course_slug || "").trim(),
    title: String(row.title || "").trim(),
    fileUrl: String(row.file_url || "").trim(),
    published: Boolean(row.published),
    sortOrder: Number.parseInt(row.sort_order, 10) || 100
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
      body: JSON.stringify({ brochures: [], configured: false, source: "fallback" })
    };
  }

  try {
    const rows = await fetchSupabaseRows(
      "course_brochures",
      "?select=*&published=eq.true&order=sort_order.asc,title.asc"
    );

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        brochures: rows.map(normalizeRecord),
        configured: true,
        source: "supabase"
      })
    };
  } catch (error) {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        brochures: [],
        configured: true,
        source: "supabase",
        error: "Brochures are temporarily unavailable"
      })
    };
  }
};
