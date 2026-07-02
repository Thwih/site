import './styles/main.css';
import { applyLanguage } from './i18n';
import { initTheme } from './modules/theme';
import { initSidebar } from './modules/sidebar';
import { initChat } from './modules/chat';
import { MusicPlayer } from './modules/player';
import { initSongList } from './modules/songList';
import { initTikTok } from './modules/tiktok';
import { initWelcome } from './modules/welcome';
import { initModal } from './modules/modal';
import { initClock } from './modules/clock';

const lang = localStorage.getItem('lang') || 'vi';
applyLanguage(lang);

initTheme();
initSidebar();
initChat();
window.player = new MusicPlayer();
initSongList();
initTikTok();
initWelcome();
initModal();
initClock();

console.log('🚀 Ứng dụng đã sẵn sàng (module).');