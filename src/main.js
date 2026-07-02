import './styles/main.css';
import './styles/components.css';
import './styles/themes.css';

import { renderHeader } from './components/header.js';
import { renderSidebar } from './components/sidebar.js';
import { renderIntro } from './components/intro.js';
import { renderMenu } from './components/menu.js';
import { renderMusic } from './components/music.js';
import { renderPlayer } from './components/player.js';
import { renderTikTok } from './components/tiktok.js';
import { renderApple } from './components/apple.js';
import { renderBottom } from './components/bottom.js';
import { renderChat } from './components/chat.js';
import { renderWelcome } from './components/welcome.js';
import { renderModal } from './components/modal.js';

import { initI18n, loadLanguage } from './i18n.js';
import { MusicPlayer } from './player.js';
import { initTikTok } from './tiktok.js';
import { fetchSongs, shortenThrice } from './api.js';
import { showToast, escapeHtml, truncateName, formatTime } from './utils.js';

// ============================================================
// 1. RENDER TẤT CẢ COMPONENT
// ============================================================
function renderAll() {
  document.getElementById('header-container').innerHTML = renderHeader();
  document.getElementById('sidebar-container').innerHTML = renderSidebar();
  document.getElementById('intro-container').innerHTML = renderIntro();
  document.getElementById('menu-container').innerHTML = renderMenu();
  document.getElementById('music-container').innerHTML = renderMusic();
  document.getElementById('player-container').innerHTML = renderPlayer();
  document.getElementById('tiktok-container').innerHTML = renderTikTok();
  document.getElementById('apple-container').innerHTML = renderApple();
  document.getElementById('bottom-container').innerHTML = renderBottom();
  document.getElementById('chat-container').innerHTML = renderChat();
  document.getElementById('welcome-container').innerHTML = renderWelcome();
  document.getElementById('modal-container').innerHTML = renderModal();
}

// ============================================================
// 2. BIẾN TOÀN CỤC
// ============================================================
let songData = [];
let songMap = new Map();
let isProcessing = false;

// ============================================================
// 3. LOAD & RENDER SONGS
// ============================================================
async function loadSongs(showToastMsg = false) {
  try {
    const files = await fetchSongs();
    songMap.clear();
    files.forEach(file => {
      if (file.id && file.name && file.link) {
        songMap.set(file.id, { id: file.id, name: file.name, link: file.link });
      }
    });
    songData = Array.from(songMap.values());
    renderSongs('');
    const countEl = document.getElementById('songCountDisplay');
    if (countEl) countEl.textContent = `${songData.length} bài hát`;
    if (showToastMsg) {
      showToast(`✅ Đã cập nhật ${songData.length} bài hát!`, 'success', 3000);
    }
  } catch (error) {
    console.error('Lỗi tải nhạc:', error);
    if (showToastMsg) showToast('❌ Không thể tải danh sách nhạc', 'error', 5000);
  }
}

function renderSongs(filter = '') {
  const songList = document.getElementById('songList');
  const countDisplay = document.getElementById('songCountDisplay');
  if (!songList) return;
  const q = filter.trim().toLowerCase();
  const filtered = q ? songData.filter(s => s.name.toLowerCase().includes(q)) : songData;
  if (countDisplay) countDisplay.textContent = `${filtered.length} bài hát`;
  if (filtered.length === 0) {
    songList.innerHTML = `<div class="no-result"><i class="fas fa-music-slash"></i> Không tìm thấy bài hát nào</div>`;
    return;
  }
  let html = '';
  filtered.forEach((song, index) => {
    const displayName = truncateName(song.name, 55);
    html += `
      <div class="song-item" data-link="${escapeHtml(song.link)}">
        <div class="left">
          <span class="stt">${index + 1}</span>
          <div class="info">
            <span class="name">${escapeHtml(displayName)}</span>
            <span class="meta"><i class="fas fa-music"></i> Get Music</span>
          </div>
        </div>
        <div class="right">
          <div class="actions">
            <button class="download-btn" title="Tải xuống"><i class="fas fa-download"></i></button>
          </div>
        </div>
      </div>
    `;
  });
  songList.innerHTML = html;

  // Gắn sự kiện click
  document.querySelectorAll('.song-item').forEach(el => {
    const link = el.dataset.link;
    el.addEventListener('click', function(e) {
      if (e.target.closest('.actions')) return;
      handleSongClick(link, this);
    });
    const downloadBtn = el.querySelector('.download-btn');
    if (downloadBtn) {
      downloadBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        handleSongClick(link, el);
      });
    }
  });
}

async function handleSongClick(originalLink, element) {
  if (isProcessing || !originalLink) return;
  isProcessing = true;

  const nameEl = element.querySelector('.name');
  const originalText = nameEl.textContent;
  const downloadBtn = element.querySelector('.download-btn');

  element.style.pointerEvents = 'none';
  if (downloadBtn) downloadBtn.style.pointerEvents = 'none';

  nameEl.innerHTML = `<span class="spinner-icon"><i class="fas fa-spinner"></i></span> Đang Tạo Link...`;
  nameEl.classList.add('loading');

  let newTab = null;
  try {
    newTab = window.open('', '_blank');
    if (newTab) {
      newTab.document.write(`
        <html><head><title>Đang tạo link...</title>
        <style>
          *{margin:0;padding:0;box-sizing:border-box;}
          body{font-family:'Segoe UI',sans-serif;display:flex;justify-content:center;align-items:center;min-height:100vh;background:#0d1a2e;color:#e8f0f8;padding:20px;}
          .container{max-width:400px;width:100%;background:rgba(15,30,50,0.6);backdrop-filter:blur(40px);border-radius:3rem;padding:2rem 1.6rem;border:1px solid rgba(100,180,255,0.1);text-align:center;}
          .spinner{width:52px;height:52px;border-radius:50%;border:4px solid rgba(74,158,255,0.08);border-top-color:#4a9eff;animation:spin 0.9s cubic-bezier(0.6,0.2,0.4,0.8) infinite;margin:0 auto;}
          @keyframes spin{to{transform:rotate(360deg);}}
          .title{font-size:1.6rem;font-weight:700;background:linear-gradient(to right,#00d2d3,#4a9eff,#6c5ce7);background-size:300% 100%;-webkit-background-clip:text;-webkit-text-fill-color:transparent;animation:grad 4s ease-in-out infinite;}
          @keyframes grad{0%{background-position:0%}50%{background-position:100%}100%{background-position:0%}}
          .bar{margin:1.2rem 0;height:6px;border-radius:10px;background:rgba(100,180,255,0.1);overflow:hidden;}
          .bar .fill{height:100%;width:0%;border-radius:10px;background:linear-gradient(90deg,#00d2d3,#4a9eff,#6c5ce7);background-size:200% 100%;animation:shimmer 1.8s ease-in-out infinite;transition:width 0.3s;}
          @keyframes shimmer{0%{background-position:-200%}100%{background-position:200%}}
          .info{display:flex;justify-content:space-between;font-size:0.7rem;color:#8aaac0;margin-top:4px;}
          .step{font-size:0.8rem;color:#8aaac0;margin-top:0.5rem;}
          .step .hl{color:#4a9eff;font-weight:600;}
          .footer{margin-top:0.8rem;font-size:0.75rem;color:#8aaac0;border-top:1px solid rgba(100,180,255,0.06);padding-top:0.8rem;}
          .footer .brand{font-weight:700;background:linear-gradient(to right,#00d2d3,#4a9eff,#6c5ce7);background-size:300% 100%;-webkit-background-clip:text;-webkit-text-fill-color:transparent;animation:grad 4s ease-in-out infinite;}
        </style>
        </head><body>
        <div class="container">
          <div class="spinner"></div>
          <div class="title">Đang tạo link</div>
          <div class="bar"><div class="fill" id="fill"></div></div>
          <div class="info"><span id="label">Đang xử lý...</span><span id="percent">0%</span></div>
          <div class="step" id="step">🔹 <span class="hl">Lần 1:</span> Đang rút gọn...</div>
          <div class="footer"><i class="fas fa-music"></i> <span class="brand">Thwih</span></div>
        </div>
        <script>
          window.updateProgress = function(pct, msg) {
            const fill=document.getElementById('fill'), label=document.getElementById('label'), percent=document.getElementById('percent'), step=document.getElementById('step');
            if(fill) fill.style.width=Math.min(pct,100)+'%';
            if(percent) percent.textContent=Math.round(Math.min(pct,100))+'%';
            if(label && msg) label.textContent=msg;
            if(step){
              if(pct<=33) step.innerHTML='🔹 <span class="hl">Lần 1:</span> Đang rút gọn...';
              else if(pct<=66) step.innerHTML='🔸 <span class="hl">Lần 2:</span> Đang rút gọn...';
              else if(pct<100) step.innerHTML='🔹 <span class="hl">Lần 3:</span> Đang rút gọn...';
              else step.innerHTML='✅ <span class="hl">Hoàn tất!</span> Chuyển hướng...';
            }
          };
        <\/script>
        </body></html>
      `);
    } else {
      showToast('⚠️ Popup bị chặn!', 'error', 4000);
    }
  } catch (e) { console.warn('Không thể mở tab mới:', e); }

  try {
    const finalLink = await shortenThrice(originalLink);
    let progress = 0;
    const interval = setInterval(() => {
      if (newTab && !newTab.closed) {
        if (progress < 90) { progress += Math.random() * 5 + 2; if (progress > 90) progress = 90; newTab.updateProgress(progress); }
      }
    }, 300);
    setTimeout(() => {
      clearInterval(interval);
      if (newTab && !newTab.closed) {
        newTab.updateProgress(100);
        setTimeout(() => { if (!newTab.closed) newTab.location.href = finalLink; }, 500);
      } else {
        window.open(finalLink, '_blank');
      }
      showToast('✅ Đã mở tab với link rút gọn!', 'success', 3000);
    }, 3000);
  } catch (error) {
    console.error('Lỗi:', error);
    showToast('❌ Đã xảy ra lỗi, vui lòng thử lại!', 'error', 4000);
    if (newTab && !newTab.closed) { try { newTab.close(); } catch(e) {} }
  } finally {
    setTimeout(() => {
      nameEl.textContent = originalText;
      nameEl.classList.remove('loading');
      element.style.pointerEvents = '';
      if (downloadBtn) downloadBtn.style.pointerEvents = '';
      isProcessing = false;
    }, 3000);
  }
}

// ============================================================
// 4. SIDEBAR
// ============================================================
function initSidebar() {
  const menuBtn = document.getElementById('menuBtn');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('menuOverlay');
  const closeBtn = document.getElementById('sidebarClose');
  if (menuBtn && sidebar && overlay && closeBtn) {
    menuBtn.addEventListener('click', () => {
      sidebar.classList.add('active');
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
    closeBtn.addEventListener('click', closeSidebar);
    overlay.addEventListener('click', closeSidebar);
    document.getElementById('sidebarThemeToggle')?.addEventListener('click', () => {
      toggleTheme();
      closeSidebar();
    });
  }
  window.closeSidebar = closeSidebar;
  window.toggleSidebarLanguage = toggleSidebarLanguage;
}

function closeSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('menuOverlay');
  if (sidebar) sidebar.classList.remove('active');
  if (overlay) overlay.classList.remove('active');
  document.body.style.overflow = '';
}

function toggleSidebarLanguage() {
  const langSelect = document.getElementById('langSelect');
  if (!langSelect) return;
  const current = langSelect.value;
  const newLang = current === 'vi' ? 'en' : 'vi';
  langSelect.value = newLang;
  langSelect.dispatchEvent(new Event('change'));
  closeSidebar();
}

// ============================================================
// 5. THEME
// ============================================================
function initTheme() {
  const toggle = document.getElementById('themeToggle');
  const icon = document.getElementById('themeIcon');
  const html = document.documentElement;
  const saved = localStorage.getItem('theme') || 'dark';
  html.setAttribute('data-theme', saved);
  updateIcon(icon, saved);
  if (toggle) {
    toggle.addEventListener('click', () => {
      const current = html.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      updateIcon(icon, next);
    });
  }
}

function toggleTheme() {
  const html = document.documentElement;
  const current = html.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  const icon = document.getElementById('themeIcon');
  updateIcon(icon, next);
}

function updateIcon(el, theme) {
  if (!el) return;
  el.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
}

// ============================================================
// 6. CLOCK
// ============================================================
let clockRAF = null;
function initClock() {
  function updateClock() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    const display = document.getElementById('clockDisplay');
    if (display) display.textContent = h + ':' + m + ':' + s;
    clockRAF = requestAnimationFrame(updateClock);
  }
  if (clockRAF) cancelAnimationFrame(clockRAF);
  updateClock();
}

// ============================================================
// 7. STARS
// ============================================================
function initStars() {
  const container = document.getElementById('starsContainer');
  if (!container) return;
  for (let i = 0; i < 60; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    const size = Math.random() * 3.5 + 1.5;
    star.style.width = size + 'px';
    star.style.height = size + 'px';
    star.style.left = Math.random() * 100 + '%';
    star.style.top = Math.random() * 100 + '%';
    star.style.setProperty('--duration', (Math.random() * 4 + 2) + 's');
    star.style.animationDelay = (Math.random() * 6) + 's';
    container.appendChild(star);
  }
}

// ============================================================
// 8. BACK TO TOP
// ============================================================
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('show', window.scrollY > 300);
  });
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ============================================================
// 9. BELL & MODAL
// ============================================================
function initBellModal() {
  const bell = document.getElementById('bellNotification');
  const modal = document.getElementById('modalOverlay');
  const closeBtn = document.getElementById('closeModalBtn');
  if (bell && modal && closeBtn) {
    bell.addEventListener('click', () => modal.classList.add('active'));
    closeBtn.addEventListener('click', () => modal.classList.remove('active'));
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('active');
    });
  }
}

// ============================================================
// 10. WELCOME
// ============================================================
function initWelcome() {
  const overlay = document.getElementById('welcomeOverlay');
  const loading = document.getElementById('loadingState');
  const content = document.getElementById('contentState');
  const btnStart = document.getElementById('welcomeBtn');
  const closeBtn = document.getElementById('closeNotiBtn');
  const percentEl = document.getElementById('loadPercent');

  if (!overlay || !loading || !content || !btnStart || !closeBtn || !percentEl) return;

  let p = 0;
  const interval = setInterval(() => {
    p += Math.floor(Math.random() * 6) + 2;
    if (p > 100) p = 100;
    percentEl.textContent = p;
    if (p === 100) {
      clearInterval(interval);
      setTimeout(() => {
        loading.style.display = 'none';
        content.style.display = 'flex';
      }, 400);
    }
  }, 80);
  setTimeout(() => {
    if (p < 100) {
      clearInterval(interval);
      percentEl.textContent = '100';
      loading.style.display = 'none';
      content.style.display = 'flex';
    }
  }, 6000);

  function closeWelcome() { overlay.classList.add('hidden'); }
  btnStart.addEventListener('click', closeWelcome);
  closeBtn.addEventListener('click', closeWelcome);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeWelcome();
  });
}

// ============================================================
// 11. CHAT
// ============================================================
function initChat() {
  const toggle = document.getElementById('chatToggle');
  const box = document.getElementById('chatBox');
  const closeBtn = document.getElementById('chatClose');
  const input = document.getElementById('chatInput');
  const sendBtn = document.getElementById('chatSend');
  const messages = document.getElementById('chatMessages');

  if (!toggle || !box || !closeBtn || !input || !sendBtn || !messages) return;

  let isFirstOpen = true;

  toggle.addEventListener('click', () => {
    box.classList.toggle('active');
    if (box.classList.contains('active')) {
      input.focus();
      if (isFirstOpen) {
        isFirstOpen = false;
        const welcome = 'Xin chào! Tôi là trợ lý AI của Thwih Music. 🎵';
        appendMessage('bot', welcome);
      }
    }
  });

  closeBtn.addEventListener('click', () => box.classList.remove('active'));

  async function sendMessage() {
    const text = input.value.trim();
    if (!text) return;
    appendMessage('user', text);
    input.value = '';

    const typing = showTyping();
    try {
      const reply = await getSmartReply(text);
      removeTyping(typing);
      appendMessage('bot', reply);
    } catch (error) {
      removeTyping(typing);
      appendMessage('bot', '❌ Có lỗi, vui lòng thử lại!');
    }
  }

  sendBtn.addEventListener('click', sendMessage);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendMessage();
  });

  window.appendMessage = appendMessage;

  function appendMessage(type, text) {
    const div = document.createElement('div');
    div.className = `message ${type}`;
    const avatar = document.createElement('span');
    avatar.className = 'avatar';
    avatar.innerHTML = type === 'bot' ? '<i class="fas fa-robot"></i>' : '<i class="fas fa-user"></i>';
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    const lines = text.split('\n');
    lines.forEach((line, i) => {
      bubble.appendChild(document.createTextNode(line));
      if (i < lines.length - 1) bubble.appendChild(document.createElement('br'));
    });
    div.appendChild(avatar);
    div.appendChild(bubble);
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  function showTyping() {
    const div = document.createElement('div');
    div.className = 'message bot typing';
    div.innerHTML = `<span class="avatar"><i class="fas fa-robot"></i></span><div class="bubble" style="min-width:60px;"><span class="typing-dots">.</span></div>`;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
    let dots = 0;
    const interval = setInterval(() => {
      const dotSpan = div.querySelector('.typing-dots');
      if (dotSpan) { dots = (dots % 3) + 1; dotSpan.textContent = '.'.repeat(dots); } else clearInterval(interval);
    }, 400);
    return { div, interval };
  }

  function removeTyping(typing) {
    if (typing && typing.div) { typing.div.remove(); clearInterval(typing.interval); }
  }

  async function getSmartReply(message) {
    try {
      const gateway = import.meta.env.VITE_API_GATEWAY || 'https://thwihsite06.weylynofficial.workers.dev/';
      const res = await fetch(`${gateway}?action=deepseek`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: 'Bạn là trợ lý AI của Thwih Music.' },
            { role: 'user', content: message }
          ],
          max_tokens: 600,
          temperature: 0.7
        })
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.error || 'DeepSeek error');
      return json.data.choices[0].message.content;
    } catch (error) {
      console.error('DeepSeek error:', error);
      const msg = message.toLowerCase();
      if (msg.includes('xin chào') || msg.includes('chào') || msg.includes('hello')) {
        return 'Xin chào! Rất vui được gặp bạn. 🎵';
      }
      return 'Tôi chưa hiểu câu hỏi. Bạn có thể hỏi về âm nhạc, lập trình, hoặc kết nối.';
    }
  }
}

// ============================================================
// 12. SEARCH INPUT
// ============================================================
function initSearch() {
  const searchInput = document.getElementById('searchInput');
  const clearSearch = document.getElementById('clearSearch');
  if (searchInput && clearSearch) {
    searchInput.addEventListener('input', function() {
      renderSongs(this.value);
      clearSearch.classList.toggle('visible', this.value.length > 0);
    });
    clearSearch.addEventListener('click', function() {
      searchInput.value = '';
      renderSongs('');
      this.classList.remove('visible');
      searchInput.focus();
    });
  }
}

// ============================================================
// 13. DOMContentLoaded - KHỞI TẠO
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  // Render HTML
  renderAll();

  // Khởi tạo các module
  initI18n();
  window.player = new MusicPlayer();
  window.player.init();
  initTikTok();
  initSidebar();
  initTheme();
  initClock();
  initStars();
  initBackToTop();
  initBellModal();
  initWelcome();
  initChat();
  initSearch();

  // Tải danh sách nhạc
  loadSongs(true);

  // Refresh button
  document.getElementById('refreshSongsBtn')?.addEventListener('click', async function() {
    const icon = this.querySelector('i');
    const text = this.querySelector('span');
    icon.classList.add('fa-spin');
    text.textContent = 'Đang cập nhật...';
    this.style.opacity = '0.7';
    this.style.pointerEvents = 'none';
    await loadSongs(true);
    icon.classList.remove('fa-spin');
    text.textContent = 'Làm mới';
    this.style.opacity = '1';
    this.style.pointerEvents = 'auto';
  });
});