const CACHE_SECONDS = 60 * 60 * 6;
const STALE_SECONDS = 60 * 60 * 24;

const COURSE_GROUPS = {
  "teaching and learning": "teachingLearning",
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

function toBoolean(value) {
  return ["yes", "true", "1", "y"].includes(String(value || "").trim().toLowerCase());
}

function normalizeKey(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function normalizeCourse(value) {
  const course = String(value || "").trim();
  const courseKey = course.toLowerCase();
  let groupKey = COURSE_GROUPS[courseKey] || "other";

  if (groupKey === "other" && courseKey.includes("teaching") && courseKey.includes("learning")) {
    groupKey = "teachingLearning";
  }

  if (groupKey === "other" && courseKey.includes("educational") && courseKey.includes("leadership")) {
    groupKey = "educationalLeadership";
  }

  return {
    label: course,
    groupKey
  };
}

function getInitials(name) {
  return String(name || "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function normalizeDriveUrl(url) {
  const rawUrl = String(url || "").trim();
  if (!rawUrl) return "";

  const fileMatch = rawUrl.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  const idMatch = rawUrl.match(/[?&]id=([^&]+)/);
  const id = fileMatch?.[1] || idMatch?.[1];

  if (id) {
    return `https://drive.google.com/thumbnail?id=${encodeURIComponent(id)}&sz=w900`;
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
  const course = normalizeCourse(row.course);
  const sortOrder = Number.parseInt(row.sort_order, 10);

  return {
    ...row,
    name: String(row.name || "").trim(),
    designation: String(row.designation || "").trim(),
    school: String(row.school || "").trim(),
    city: String(row.city || "").trim(),
    course: course.label,
    courseGroup: course.groupKey,
    score: String(row.score || "").trim(),
    photoUrl: normalizeDriveUrl(row.photo_url),
    initials: getInitials(row.name),
    featured: toBoolean(row.featured),
    published: toBoolean(row.published),
    sortOrder: Number.isFinite(sortOrder) ? sortOrder : 9999
  };
}

function groupRecords(records) {
  const groups = {
    teachingLearning: [],
    educationalLeadership: [],
    other: []
  };
  const featured = {
    teachingLearning: [],
    educationalLeadership: [],
    other: []
  };

  records.forEach((record) => {
    const groupKey = groups[record.courseGroup] ? record.courseGroup : "other";
    groups[groupKey].push(record);
    if (record.featured) featured[groupKey].push(record);
  });

  return { groups, featured };
}

exports.handler = async function handler() {
  const headers = {
    "Cache-Control": `public, s-maxage=${CACHE_SECONDS}, stale-while-revalidate=${STALE_SECONDS}`,
    "Content-Type": "application/json"
  };

  const sheetUrl = normalizeSheetUrl(process.env.RESULTS_SHEET_CSV_URL || process.env.GOOGLE_SHEET_CSV_URL);

  if (!sheetUrl) {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ results: [], groups: {}, featured: [], configured: false })
    };
  }

  try {
    const response = await fetch(sheetUrl);
    if (!response.ok) throw new Error("Results sheet unavailable");

    const csv = await response.text();
    const rows = parseCsv(csv);
    const headersRow = rows.shift() || [];
    const keys = headersRow.map(normalizeKey);
    const results = rows
      .map((row) =>
        keys.reduce((record, key, index) => {
          if (key) record[key] = row[index] || "";
          return record;
        }, {})
      )
      .map(normalizeRecord)
      .filter((record) => record.published && record.name)
      .sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name));

    const grouped = groupRecords(results);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        results,
        groups: grouped.groups,
        featured: grouped.featured,
        configured: true
      })
    };
  } catch (error) {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ results: [], groups: {}, featured: {}, configured: true })
    };
  }
};
