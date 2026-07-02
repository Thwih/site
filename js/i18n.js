import { TRANSLATIONS, DEFAULT_LANG, STORAGE_KEYS } from './config.js';

export function getLang() {
  return localStorage.getItem(STORAGE_KEYS.LANG) || DEFAULT_LANG;
}

export function setLang(lang) {
  localStorage.setItem(STORAGE_KEYS.LANG, lang);
  document.documentElement.lang = lang;
}

export function applyLanguage(lang) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS[DEFAULT_LANG];
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
  // Update player if exists
  if (window.player && window.player.updateI18n) {
    window.player.updateI18n(t);
  }
}