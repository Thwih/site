import { API_GATEWAY, CACHE_KEY } from './config.js';

// Toast
export function showToast(message, type = 'info', duration = 5000) {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast-item ${type}`;
  const icons = { error: 'fa-exclamation-circle', success: 'fa-check-circle', info: 'fa-info-circle' };
  toast.innerHTML = `<i class="fas ${icons[type] || icons.info}"></i><span>${message}</span><button class="close-toast"><i class="fas fa-times"></i></button>`;
  toast.querySelector('.close-toast').addEventListener('click', () => toast.remove());
  container.appendChild(toast);
  setTimeout(() => { if (toast.parentNode) toast.remove(); }, duration);
}

// Shorten
function getCache() {
  try { return JSON.parse(localStorage.getItem(CACHE_KEY)) || {}; } catch { return {}; }
}
function setCache(orig, shortened) {
  const c = getCache();
  c[orig] = shortened;
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(c)); } catch {}
}
async function shortenOnce(url) {
  const resp = await fetch(`${API_GATEWAY}?action=shorten&url=${encodeURIComponent(url)}`);
  if (!resp.ok) { const e = await resp.json(); throw new Error(e.error || `HTTP ${resp.status}`); }
  const json = await resp.json();
  if (!json.success || !json.data?.shortenedUrl) throw new Error('Invalid shorten response');
  return json.data.shortenedUrl;
}
export async function shortenThrice(originalUrl) {
  const cache = getCache();
  if (cache[originalUrl]) return cache[originalUrl];
  try {
    let cur = await shortenOnce(originalUrl);
    cur = await shortenOnce(cur);
    cur = await shortenOnce(cur);
    setCache(originalUrl, cur);
    return cur;
  } catch (e) {
    console.error('Shorten fallback:', e);
    return originalUrl;
  }
}

export function escapeHtml(str) {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

export function truncateName(name, maxLen = 55) {
  return name.length <= maxLen ? name : name.substring(0, maxLen) + '...';
}