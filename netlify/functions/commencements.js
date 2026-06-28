const { fetchSupabaseRows, usesSupabaseContent } = require("../lib/supabase");

const CACHE_SECONDS = 60 * 60 * 12;
const STALE_SECONDS = 60 * 60 * 24;

const COURSE_GROUPS = {
  "teaching and learning": "teachingLearning",
  "teaching & learning": "teachingLearning",
  cidtl: "teachingLearning",
  "educational leadership": "educationalLeadership",
  cidel: "educationalLeadership"
};

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

function normalizeCourse(value) {
  const label = String(value || "").trim();
  const key = label.toLowerCase();
  let groupKey = COURSE_GROUPS[key] || "other";

  if (groupKey === "other" && key.includes("teaching") && key.includes("learning")) {
    groupKey = "teachingLearning";
  }

  if (groupKey === "other" && key.includes("educational") && key.includes("leadership")) {
    groupKey = "educationalLeadership";
  }

  return { label, groupKey };
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
  const course = normalizeCourse(row.course);
  const sortOrder = Number.parseInt(row.sort_order, 10);

  return {
    ...row,
    course: course.label,
    courseGroup: course.groupKey,
    commencementDate: String(row.commencement_date || row.date || "").trim(),
    label: String(row.label || "New Cohort Commencement Date").trim(),
    url: String(row.url || "").trim(),
    published: toBoolean(row.published),
    sortOrder: Number.isFinite(sortOrder) ? sortOrder : 9999
  };
}

function formatDatabaseDate(value) {
  const rawValue = String(value || "").trim();
  if (!rawValue) return "";

  const date = new Date(`${rawValue.slice(0, 10)}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return rawValue;

  return new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC"
  }).format(date);
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
        "commencement_dates",
        "?select=*&published=eq.true&order=sort_order.asc,course.asc"
      );
      const commencements = rows.map((row) =>
        normalizeRecord({
          ...row,
          commencement_date: row.display_date || formatDatabaseDate(row.commencement_date)
        })
      );
      const byCourse = commencements.reduce((records, record) => {
        if (!records[record.courseGroup]) records[record.courseGroup] = record;
        return records;
      }, {});

      return {
        statusCode: 200,
        headers: supabaseHeaders,
        body: JSON.stringify({
          commencements,
          byCourse,
          configured: true,
          source: "supabase"
        })
      };
    } catch (error) {
      console.warn("Supabase commencement dates unavailable; trying the configured sheet fallback.");
    }
  }

  const sheetUrl = normalizeSheetUrl(process.env.COMMENCEMENTS_SHEET_CSV_URL);

  if (!sheetUrl) {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ commencements: [], byCourse: {}, configured: false, source: "fallback" })
    };
  }

  try {
    const response = await fetch(sheetUrl);
    if (!response.ok) throw new Error("Commencements sheet unavailable");

    const csv = await response.text();
    const rows = parseCsv(csv);
    const headersRow = rows.shift() || [];
    const keys = headersRow.map(normalizeKey);
    const commencements = rows
      .map((row) =>
        keys.reduce((record, key, index) => {
          if (key) record[key] = row[index] || "";
          return record;
        }, {})
      )
      .map(normalizeRecord)
      .filter((record) => record.published && record.courseGroup !== "other" && record.commencementDate)
      .sort((a, b) => a.sortOrder - b.sortOrder || a.course.localeCompare(b.course));

    const byCourse = commencements.reduce((records, record) => {
      if (!records[record.courseGroup]) records[record.courseGroup] = record;
      return records;
    }, {});

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ commencements, byCourse, configured: true, source: "google-sheet" })
    };
  } catch (error) {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ commencements: [], byCourse: {}, configured: true, source: "google-sheet" })
    };
  }
};
