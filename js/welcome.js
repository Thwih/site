export function initWelcome() {
    const welcomeOverlay = document.getElementById('welcomeOverlay');
    const loadingState = document.getElementById('loadingState');
    const contentState = document.getElementById('contentState');
    const welcomeBtn = document.getElementById('welcomeBtn');
    const closeNotiBtn = document.getElementById('closeNotiBtn');
    const loadPercent = document.getElementById('loadPercent');

    if (!welcomeOverlay || !loadingState || !contentState || !welcomeBtn || !closeNotiBtn || !loadPercent) return;

    let percent = 0;
    const loadInterval = setInterval(() => {
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
    setTimeout(() => {
        if (percent < 100) {
            clearInterval(loadInterval);
            loadPercent.textContent = '100';
            loadingState.style.display = 'none';
            contentState.style.display = 'flex';
        }
    }, 6000);

    function closeWelcome() { welcomeOverlay.classList.add('hidden'); }
    welcomeBtn.addEventListener('click', closeWelcome);
    closeNotiBtn.addEventListener('click', closeWelcome);
    welcomeOverlay.addEventListener('click', (e) => {
        if (e.target === welcomeOverlay) closeWelcome();
    });
}