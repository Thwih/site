import { API_GATEWAY } from '../config/api';

const CACHE_KEY = 'shorten_cache_v8';

function getCache() {
  try { return JSON.parse(localStorage.getItem(CACHE_KEY)) || {}; } catch { return {}; }
}

function setCache(originalUrl, cachedUrl) {
  const cache = getCache();
  cache[originalUrl] = cachedUrl;
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(cache)); } catch (e) {}
}

async function shortenOnce(url) {
  const resp = await fetch(`${API_GATEWAY}?action=shorten&url=${encodeURIComponent(url)}`);
  if (!resp.ok) {
    const err = await resp.json();
    throw new Error(err.error || `HTTP ${resp.status}`);
  }
  const json = await resp.json();
  if (!json.success || !json.data || !json.data.shortenedUrl) {
    throw new Error('Worker trả về dữ liệu không hợp lệ');
  }
  return json.data.shortenedUrl;
}

export async function shortenThrice(originalUrl) {
  const cache = getCache();
  if (cache[originalUrl]) return cache[originalUrl];
  try {
    let currentUrl = originalUrl;
    currentUrl = await shortenOnce(currentUrl);
    currentUrl = await shortenOnce(currentUrl);
    currentUrl = await shortenOnce(currentUrl);
    setCache(originalUrl, currentUrl);
    return currentUrl;
  } catch (error) {
    console.error('❌ Lỗi vượt link, fallback:', error);
    return originalUrl;
  }
}