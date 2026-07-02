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
  setTimeout(() => {
    if (toast.parentNode) toast.remove();
  }, duration);
}