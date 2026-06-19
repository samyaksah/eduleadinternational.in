const CACHE_SECONDS = 60 * 15;

export default async function handler(request, response) {
  response.setHeader("Cache-Control", `s-maxage=${CACHE_SECONDS}, stale-while-revalidate=3600`);

  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  const userId = process.env.INSTAGRAM_USER_ID || "me";

  if (!token) {
    response.status(200).json({ posts: [] });
    return;
  }

  const fields = "id,caption,media_type,media_url,permalink,thumbnail_url,timestamp";
  const url = `https://graph.instagram.com/${userId}/media?fields=${fields}&limit=6&access_token=${token}`;

  try {
    const instagramResponse = await fetch(url);

    if (!instagramResponse.ok) {
      response.status(200).json({ posts: [] });
      return;
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

    response.status(200).json({ posts });
  } catch (error) {
    response.status(200).json({ posts: [] });
  }
}
