export function initModal() {
  const bell = document.getElementById('bellNotification');
  const modalOverlay = document.getElementById('modalOverlay');
  const closeModalBtn = document.getElementById('closeModalBtn');
  if (!bell || !modalOverlay || !closeModalBtn) return;

  bell.addEventListener('click', function() {
    this.classList.add('ring');
    setTimeout(() => this.classList.remove('ring'), 600);
    modalOverlay.classList.add('active');
  });

  closeModalBtn.addEventListener('click', () => modalOverlay.classList.remove('active'));

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) modalOverlay.classList.remove('active');
  });
}