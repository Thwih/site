const API_GATEWAY = import.meta.env.VITE_API_GATEWAY || 'https://thwihsite06.weylynofficial.workers.dev/';

export async function fetchSongs() {
  const res = await fetch(`${API_GATEWAY}?action=drive`);
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Worker error');
  return data.data.files; // Mảng { id, name, link }
}

export async function fetchTikTok(url) {
  const res = await fetch(`${API_GATEWAY}?action=tiktok&url=${encodeURIComponent(url)}`);
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || `HTTP ${res.status}`);
  }
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'TikTok API error');
  return data.data; // { videoUrl, audioUrl, cover, title, author }
}

export async function shortenUrl(url) {
  const res = await fetch(`${API_GATEWAY}?action=shorten&url=${encodeURIComponent(url)}`);
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  const data = await res.json();
  if (!data.success || !data.data || !data.data.shortenedUrl) {
    throw new Error('Worker trả về dữ liệu không hợp lệ');
  }
  return data.data.shortenedUrl;
}

export async function shortenThrice(originalUrl, cacheKey = 'shorten_cache_v8') {
  const cache = getCache(cacheKey);
  if (cache[originalUrl]) return cache[originalUrl];
  try {
    let currentUrl = originalUrl;
    currentUrl = await shortenUrl(currentUrl);
    currentUrl = await shortenUrl(currentUrl);
    currentUrl = await shortenUrl(currentUrl);
    cache[originalUrl] = currentUrl;
    setCache(cacheKey, cache);
    return currentUrl;
  } catch (error) {
    console.error('Lỗi vượt link, fallback về link gốc:', error);
    return originalUrl;
  }
}