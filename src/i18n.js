let currentLang = localStorage.getItem('lang') || 'vi';
let translations = {};

export async function loadLanguage(lang) {
  try {
    const res = await fetch(`/src/locales/${lang}.json`);
    translations = await res.json();
    currentLang = lang;
    localStorage.setItem('lang', lang);
    applyTranslations();
    document.documentElement.lang = lang;
  } catch (e) {
    console.error('Lỗi tải ngôn ngữ:', e);
  }
}

export function getTranslation(key) {
  return translations[key] || key;
}

export function getCurrentLang() {
  return currentLang;
}

function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (translations[key] !== undefined) {
      el.innerHTML = translations[key];
    }
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.dataset.i18nPlaceholder;
    if (translations[key] !== undefined) {
      el.placeholder = translations[key];
    }
  });
  // Cập nhật các thành phần đặc biệt
  const playerSongName = document.getElementById('playerSongName');
  const playerArtistName = document.getElementById('playerArtistName');
  if (playerSongName && window.player && window.player.playlist.length === 0) {
    playerSongName.textContent = translations.player_no_song || 'Chưa có nhạc';
    if (playerArtistName) playerArtistName.textContent = translations.player_user || 'Người dùng';
  }
  // Cập nhật AI welcome nếu chat chưa có tin nhắn
  const chatMessages = document.getElementById('chatMessages');
  if (chatMessages && chatMessages.children.length === 0 && window.appendMessage) {
    window.appendMessage('bot', translations.ai_welcome);
  }
}

export function initI18n() {
  const saved = localStorage.getItem('lang') || 'vi';
  loadLanguage(saved);
  document.getElementById('langSelect')?.addEventListener('change', (e) => {
    loadLanguage(e.target.value);
  });
}