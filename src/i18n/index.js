import vi from './locales/vi.json';
import en from './locales/en.json';

const locales = { vi, en };

export function applyLanguage(lang) {
  const t = locales[lang] || locales.vi;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (t[key] !== undefined) {
      if (el.tagName === 'INPUT' && el.hasAttribute('data-i18n-placeholder')) {
        el.placeholder = t[key];
      } else {
        el.innerHTML = t[key];
      }
    }
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.dataset.i18nPlaceholder;
    if (t[key] !== undefined) el.placeholder = t[key];
  });
  localStorage.setItem('lang', lang);
  document.documentElement.lang = lang;

  const chatMessages = document.getElementById('chatMessages');
  if (chatMessages && chatMessages.children.length === 0 && typeof window.appendMessage === 'function') {
    window.appendMessage('bot', t.ai_welcome);
  }

  const playerSongName = document.getElementById('playerSongName');
  const playerArtistName = document.getElementById('playerArtistName');
  if (playerSongName && window.player && window.player.playlist.length === 0) {
    playerSongName.textContent = t.player_no_song || 'Chưa có nhạc';
    if (playerArtistName) playerArtistName.textContent = t.player_user || 'Người dùng';
  }
}