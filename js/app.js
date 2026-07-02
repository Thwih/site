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
    createStars();
    // Ngôn ngữ
    const savedLang = localStorage.getItem('lang') || 'vi';
    applyLanguage(savedLang);
    const langSelect = document.getElementById('langSelect');
    if (langSelect) {
        langSelect.value = savedLang;
        langSelect.addEventListener('change', function() {
            applyLanguage(this.value);
        });
    }
    initTheme();
    initClock();
    initSidebar();
    initChat();
    initWelcome();
    initSongs();  // <-- Gọi initSongs để fetch
    window.player = new MusicPlayer();
    initTikTok();
    // Back to top, modal...
    console.log('Ứng dụng đã sẵn sàng.');
});