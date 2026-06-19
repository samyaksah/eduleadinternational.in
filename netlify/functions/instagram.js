const CACHE_SECONDS = 60 * 60 * 12;
const STALE_SECONDS = 60 * 60 * 24;

exports.handler = async function handler() {
  const headers = {
    "Cache-Control": `public, s-maxage=${CACHE_SECONDS}, stale-while-revalidate=${STALE_SECONDS}`,
    "Content-Type": "application/json"
  };

  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  const userId = process.env.INSTAGRAM_USER_ID || "me";

  if (!token) {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ posts: [] })
    };
  }

  const fields = "id,caption,media_type,media_url,permalink,thumbnail_url,timestamp";
  const url = `https://graph.instagram.com/${userId}/media?fields=${fields}&limit=6&access_token=${token}`;

  try {
    const instagramResponse = await fetch(url);

    if (!instagramResponse.ok) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ posts: [] })
      };
    }

    const payload = await instagramResponse.json();
    const posts = (payload.data || [])
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .map((post) => ({
        id: post.id,
        caption: post.caption || "",
        mediaType: post.media_type,
        mediaUrl: post.thumbnail_url || post.media_url,
        permalink: post.permalink,
        timestamp: post.timestamp
      }));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ posts })
    };
  } catch (error) {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ posts: [] })
    };
  }
};
