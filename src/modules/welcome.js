export function initWelcome() {
  const overlay = document.getElementById('welcomeOverlay');
  const loadingState = document.getElementById('loadingState');
  const contentState = document.getElementById('contentState');
  const welcomeBtn = document.getElementById('welcomeBtn');
  const closeNotiBtn = document.getElementById('closeNotiBtn');
  const loadPercent = document.getElementById('loadPercent');

  if (!overlay || !loadingState || !contentState || !welcomeBtn || !closeNotiBtn || !loadPercent) return;

  let percent = 0;
  let loadInterval = setInterval(() => {
    percent += Math.floor(Math.random() * 6) + 2;
    if (percent > 100) percent = 100;
    loadPercent.textContent = percent;
    if (percent === 100) {
      clearInterval(loadInterval);
      setTimeout(() => {
        loadingState.style.display = 'none';
        contentState.style.display = 'flex';
      }, 400);
    }
  }, 80);

  // Fallback
  setTimeout(() => {
    if (percent < 100) {
      clearInterval(loadInterval);
      loadPercent.textContent = '100';
      loadingState.style.display = 'none';
      contentState.style.display = 'flex';
    }
  }, 6000);

  function closeWelcome() {
    overlay.classList.add('hidden');
  }

  welcomeBtn.addEventListener('click', closeWelcome);
  closeNotiBtn.addEventListener('click', closeWelcome);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeWelcome();
  });
}