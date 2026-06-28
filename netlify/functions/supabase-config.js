const { getSupabaseConfig, jsonResponse } = require("../lib/supabase");

exports.handler = async function handler() {
  const config = getSupabaseConfig();

  return jsonResponse(
    {
      configured: config.configured,
      url: config.configured ? config.url : "",
      publishableKey: config.configured ? config.publishableKey : "",
      storageBucket: "site-media"
    },
    200,
    {
      "Cache-Control": "no-store"
    }
  );
};
