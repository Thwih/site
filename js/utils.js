export function showToast(message, type = 'info', duration = 5000) {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast-item ${type}`;
    const iconMap = { error: 'fa-exclamation-circle', success: 'fa-check-circle', info: 'fa-info-circle' };
    toast.innerHTML = `
        <i class="fas ${iconMap[type] || iconMap.info}"></i>
        <span>${message}</span>
        <button class="close-toast"><i class="fas fa-times"></i></button>
    `;
    const closeBtn = toast.querySelector('.close-toast');
    closeBtn.addEventListener('click', () => toast.remove());
    container.appendChild(toast);
    setTimeout(() => { if (toast.parentNode) toast.remove(); }, duration);
}

export function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

export function truncateName(name, maxLen = 55) {
    return name.length <= maxLen ? name : name.substring(0, maxLen) + '...';
}

export function formatTime(seconds) {
    if (isNaN(seconds) || !isFinite(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return mins + ':' + String(secs).padStart(2, '0');
}

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
        console.error('Lỗi vượt link, fallback về link gốc:', error);
        return originalUrl;
    }
}

export function isValidTikTokUrl(url) {
    if (!url) return false;
    url = url.trim();
    const patterns = [
        /^https?:\/\/(www\.)?tiktok\.com\/@[\w.]+\/video\/\d+/i,
        /^https?:\/\/(vm|vt)\.tiktok\.com\/[\w-]+/i,
        /^https?:\/\/(www\.)?tiktok\.com\/@[\w.]+\/v\/\d+/i,
        /^https?:\/\/(www\.)?tiktok\.com\/@[\w.]+\/photo\/\d+/i
    ];
    return patterns.some(pattern => pattern.test(url));
}

export function safeString(value) {
    if (value == null) return '';
    if (typeof value === 'string') return value;
    if (typeof value === 'number') return String(value);
    if (typeof value === 'boolean') return String(value);
    if (typeof value === 'object') {
        if (value.name && typeof value.name === 'string') return value.name;
        if (value.username && typeof value.username === 'string') return value.username;
        if (value.nickname && typeof value.nickname === 'string') return value.nickname;
        if (value.title && typeof value.title === 'string') return value.title;
        if (value.text && typeof value.text === 'string') return value.text;
        if (value.url && typeof value.url === 'string') return value.url;
        if (value.uniqueId && typeof value.uniqueId === 'string') return value.uniqueId;
        if (value.id && typeof value.id === 'string') return value.id;
        if (value.author && typeof value.author === 'string') return value.author;
        if (value.toString && value.toString !== Object.prototype.toString) {
            const s = value.toString();
            if (s !== '[object Object]') return s;
        }
        try {
            const str = JSON.stringify(value);
            if (str && str !== '{}' && str !== '[]') {
                if (str.length > 50) return str.substring(0, 47) + '...';
                return str;
            }
        } catch (e) { return ''; }
    }
    return String(value);
}

export function createStars() {
    const container = document.getElementById('starsContainer');
    if (!container) return;
    for (let i = 0; i < 60; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        const size = Math.random() * 3.5 + 1.5;
        star.style.width = size + 'px';
        star.style.height = size + 'px';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.setProperty('--duration', (Math.random() * 4 + 2) + 's');
        star.style.animationDelay = (Math.random() * 6) + 's';
        star.style.boxShadow = `0 0 ${size * 2}px ${size * 0.8}px rgba(74, 158, 255, 0.25)`;
        container.appendChild(star);
    }
}