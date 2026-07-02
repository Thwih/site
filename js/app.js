import { applyLanguage } from './translations.js';
import { initTheme } from './theme.js';
import { initClock } from './clock.js';
import { initSidebar } from './sidebar.js';
import { initChat } from './chat.js';
import { initWelcome } from './welcome.js';
import { initSongs } from './songs.js';
import { MusicPlayer } from './player.js';
import { initTikTok } from './tiktok.js';
import { createStars } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Tạo sao
    createStars();

    // 2. Ngôn ngữ
    const savedLang = localStorage.getItem('lang') || 'vi';
    applyLanguage(savedLang);
    const langSelect = document.getElementById('langSelect');
    if (langSelect) {
        langSelect.value = savedLang;
        langSelect.addEventListener('change', function() {
            applyLanguage(this.value);
        });
    }

    // 3. Theme
    initTheme();

    // 4. Clock
    initClock();

    // 5. Sidebar
    initSidebar();

    // 6. Chat
    initChat();

    // 7. Welcome
    initWelcome();

    // 8. Songs (tự động fetch và render)
    initSongs();

    // 9. Player
    window.player = new MusicPlayer();

    // 10. TikTok
    initTikTok();

    // 11. Back to top
    const backToTopBtn = document.getElementById('backToTop');
    window.addEventListener('scroll', () => {
        if (backToTopBtn) {
            if (window.scrollY > 300) backToTopBtn.classList.add('show');
            else backToTopBtn.classList.remove('show');
        }
    });
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // 12. Modal
    const bell = document.getElementById('bellNotification');
    const modalOverlay = document.getElementById('modalOverlay');
    const closeModalBtn = document.getElementById('closeModalBtn');
    if (bell && modalOverlay && closeModalBtn) {
        bell.addEventListener('click', function() {
            modalOverlay.classList.add('active');
        });
        closeModalBtn.addEventListener('click', () => modalOverlay.classList.remove('active'));
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) modalOverlay.classList.remove('active');
        });
    }

    console.log('Ứng dụng đã sẵn sàng.');
});