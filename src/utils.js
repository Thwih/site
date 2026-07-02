export function formatTime(seconds) {
  if (isNaN(seconds) || !isFinite(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return mins + ':' + String(secs).padStart(2, '0');
}

export function truncateName(name, maxLen = 55) {
  return name.length <= maxLen ? name : name.substring(0, maxLen) + '...';
}

export function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

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

export function getCache(key) {
  try { return JSON.parse(localStorage.getItem(key)) || {}; } catch { return {}; }
}

export function setCache(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
}