const DEFAULT_HEADERS = {
  "Content-Type": "application/json"
};

function getSupabaseConfig() {
  const url = String(process.env.SUPABASE_URL || "").replace(/\/+$/, "");
  const publishableKey = String(process.env.SUPABASE_PUBLISHABLE_KEY || "");

  return {
    url,
    publishableKey,
    configured: Boolean(url && publishableKey)
  };
}

function usesSupabaseContent() {
  return String(process.env.CONTENT_SOURCE || "").trim().toLowerCase() === "supabase";
}

async function fetchSupabaseRows(table, query = "") {
  const config = getSupabaseConfig();
  if (!config.configured) throw new Error("Supabase is not configured");

  const response = await fetch(`${config.url}/rest/v1/${table}${query}`, {
    headers: {
      apikey: config.publishableKey,
      Accept: "application/json"
    }
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Supabase request failed (${response.status}): ${detail}`);
  }

  return response.json();
}

function jsonResponse(body, statusCode = 200, headers = {}) {
  return {
    statusCode,
    headers: {
      ...DEFAULT_HEADERS,
      ...headers
    },
    body: JSON.stringify(body)
  };
}

module.exports = {
  fetchSupabaseRows,
  getSupabaseConfig,
  jsonResponse,
  usesSupabaseContent
};
