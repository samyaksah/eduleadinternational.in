const { fetchSupabaseRows, usesSupabaseContent } = require("../lib/supabase");

const CACHE_SECONDS = 60 * 60 * 6;
const STALE_SECONDS = 60 * 60 * 24;

function parseCsv(csv) {
  const rows = [];
  let row = [];
  let value = "";
  let inQuotes = false;

  for (let index = 0; index < csv.length; index += 1) {
    const char = csv[index];
    const next = csv[index + 1];

    if (char === '"' && inQuotes && next === '"') {
      value += '"';
      index += 1;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      row.push(value);
      value = "";
    } else if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") index += 1;
      row.push(value);
      if (row.some((cell) => cell.trim())) rows.push(row);
      row = [];
      value = "";
    } else {
      value += char;
    }
  }

  row.push(value);
  if (row.some((cell) => cell.trim())) rows.push(row);
  return rows;
}

function normalizeKey(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function toBoolean(value) {
  return ["yes", "true", "1", "y"].includes(String(value || "").trim().toLowerCase());
}

function normalizeDriveUrl(url) {
  const rawUrl = String(url || "").trim();
  if (!rawUrl) return "";

  const fileMatch = rawUrl.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  const idMatch = rawUrl.match(/[?&]id=([^&]+)/);
  const id = fileMatch?.[1] || idMatch?.[1];

  if (id) {
    return `https://drive.google.com/thumbnail?id=${encodeURIComponent(id)}&sz=w1400`;
  }

  return rawUrl;
}

function normalizeSheetUrl(url) {
  const rawUrl = String(url || "").trim();
  if (!rawUrl) return "";
  if (rawUrl.includes("output=csv") || rawUrl.endsWith(".csv")) return rawUrl;

  const sheetMatch = rawUrl.match(/docs\.google\.com\/spreadsheets\/d\/([^/]+)/);
  if (!sheetMatch) return rawUrl;

  const gidMatch = rawUrl.match(/[?&#]gid=([^&#]+)/);
  const gid = gidMatch?.[1] || "0";
  return `https://docs.google.com/spreadsheets/d/${encodeURIComponent(sheetMatch[1])}/export?format=csv&gid=${encodeURIComponent(gid)}`;
}

function normalizeRecord(row) {
  const sortOrder = Number.parseInt(row.sort_order, 10);

  return {
    ...row,
    imageUrl: normalizeDriveUrl(row.image_url || row.photo_url || row.url),
    description: String(row.description || "").trim(),
    published: toBoolean(row.published),
    sortOrder: Number.isFinite(sortOrder) ? sortOrder : 9999
  };
}

exports.handler = async function handler() {
  const headers = {
    "Cache-Control": `public, s-maxage=${CACHE_SECONDS}, stale-while-revalidate=${STALE_SECONDS}`,
    "Content-Type": "application/json"
  };

  if (usesSupabaseContent()) {
    const supabaseHeaders = {
      ...headers,
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300"
    };
    try {
      const rows = await fetchSupabaseRows(
        "gallery_items",
        "?select=*&published=eq.true&order=sort_order.asc,created_at.asc"
      );
      const gallery = rows.map(normalizeRecord);

      return {
        statusCode: 200,
        headers: supabaseHeaders,
        body: JSON.stringify({ gallery, configured: true, source: "supabase" })
      };
    } catch (error) {
      console.warn("Supabase gallery unavailable; trying the configured sheet fallback.");
    }
  }

  const sheetUrl = normalizeSheetUrl(process.env.GALLERY_SHEET_CSV_URL);

  if (!sheetUrl) {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ gallery: [], configured: false, source: "fallback" })
    };
  }

  try {
    const response = await fetch(sheetUrl);
    if (!response.ok) throw new Error("Gallery sheet unavailable");

    const csv = await response.text();
    const rows = parseCsv(csv);
    const headersRow = rows.shift() || [];
    const keys = headersRow.map(normalizeKey);
    const gallery = rows
      .map((row) =>
        keys.reduce((record, key, index) => {
          if (key) record[key] = row[index] || "";
          return record;
        }, {})
      )
      .map(normalizeRecord)
      .filter((record) => record.published && record.imageUrl && record.description)
      .sort((a, b) => a.sortOrder - b.sortOrder || a.description.localeCompare(b.description));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ gallery, configured: true, source: "google-sheet" })
    };
  } catch (error) {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ gallery: [], configured: true, source: "google-sheet" })
    };
  }
};
