// ===== js/ui.js =====
import { API_GATEWAY, TRANSLATIONS } from './config.js';
import { showToast } from './utils.js';
import { applyLanguage, getLang, setLang } from './i18n.js';

export function initUI() {
  // Theme
  const toggle = document.getElementById('themeToggle');
  const icon = document.getElementById('themeIcon');
  const html = document.documentElement;
  let currentTheme = localStorage.getItem('theme') || 'dark';
  html.setAttribute('data-theme', currentTheme);
  const updateToggleUI = (theme) => { if (icon) icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun'; };
  updateToggleUI(currentTheme);
  if (toggle) {
    toggle.addEventListener('click', () => {
      const newTheme = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateToggleUI(newTheme);
    });
  }

  // Sidebar
  const menuBtn = document.getElementById('menuBtn');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('menuOverlay');
  const closeSidebarBtn = document.getElementById('sidebarClose');
  const openSidebar = () => { sidebar.classList.add('active'); overlay.classList.add('active'); document.body.style.overflow = 'hidden'; };
  window.closeSidebar = () => { sidebar.classList.remove('active'); overlay.classList.remove('active'); document.body.style.overflow = ''; };
  if (menuBtn) menuBtn.addEventListener('click', openSidebar);
  if (closeSidebarBtn) closeSidebarBtn.addEventListener('click', window.closeSidebar);
  if (overlay) overlay.addEventListener('click', window.closeSidebar);

  // Sidebar theme toggle
  const sidebarTheme = document.getElementById('sidebarThemeToggle');
  if (sidebarTheme) {
    sidebarTheme.addEventListener('click', function() {
      const newTheme = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateToggleUI(newTheme);
      window.closeSidebar();
    });
  }

  // Sidebar language toggle
  window.toggleSidebarLanguage = function() {
    const current = getLang();
    const newLang = current === 'vi' ? 'en' : 'vi';
    const langSelect = document.getElementById('langSelect');
    if (langSelect) langSelect.value = newLang;
    applyLanguage(newLang);
    window.closeSidebar();
  };

  // Language selector
  const langSelect = document.getElementById('langSelect');
  if (langSelect) {
    langSelect.value = getLang();
    langSelect.addEventListener('change', function() {
      applyLanguage(this.value);
    });
  }

  // Bell & modal
  const bell = document.getElementById('bellNotification');
  const modal = document.getElementById('modalOverlay');
  const closeModal = document.getElementById('closeModalBtn');
  if (bell && modal && closeModal) {
    bell.addEventListener('click', () => modal.classList.add('active'));
    closeModal.addEventListener('click', () => modal.classList.remove('active'));
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('active'); });
  }

  // Clock
  let clockRAF = null;
  function updateClock() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2,'0');
    const m = String(now.getMinutes()).padStart(2,'0');
    const s = String(now.getSeconds()).padStart(2,'0');
    const display = document.getElementById('clockDisplay');
    if (display) display.textContent = h + ':' + m + ':' + s;
    clockRAF = requestAnimationFrame(updateClock);
  }
  if (clockRAF) cancelAnimationFrame(clockRAF);
  updateClock();

  // Back to top
  const backBtn = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    if (backBtn) {
      if (window.scrollY > 300) backBtn.classList.add('show');
      else backBtn.classList.remove('show');
    }
  });
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Stars
  const starsContainer = document.getElementById('starsContainer');
  if (starsContainer) {
    for (let i=0; i<60; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      const size = Math.random() * 3.5 + 1.5;
      star.style.width = size + 'px';
      star.style.height = size + 'px';
      star.style.left = Math.random() * 100 + '%';
      star.style.top = Math.random() * 100 + '%';
      star.style.setProperty('--duration', (Math.random() * 4 + 2) + 's');
      star.style.animationDelay = (Math.random() * 6) + 's';
      star.style.boxShadow = `0 0 ${size * 2}px ${size * 0.8}px rgba(74,158,255,0.25)`;
      starsContainer.appendChild(star);
    }
  }

  // Welcome overlay – hiển thị ngay, không loading
  const welcomeOverlay = document.getElementById('welcomeOverlay');
  const welcomeBtn = document.getElementById('welcomeBtn');
  const closeNotiBtn = document.getElementById('closeNotiBtn');
  if (welcomeOverlay && welcomeBtn && closeNotiBtn) {
    const closeWelcome = () => welcomeOverlay.classList.add('hidden');
    welcomeBtn.addEventListener('click', closeWelcome);
    closeNotiBtn.addEventListener('click', closeWelcome);
    welcomeOverlay.addEventListener('click', (e) => {
      if (e.target === welcomeOverlay) closeWelcome();
    });
  }

  // Chat
  const chatToggle = document.getElementById('chatToggle');
  const chatBox = document.getElementById('chatBox');
  const chatClose = document.getElementById('chatClose');
  const chatInput = document.getElementById('chatInput');
  const chatSend = document.getElementById('chatSend');
  const chatMessages = document.getElementById('chatMessages');
  let isFirstOpen = true;

  window.appendMessage = function(type, text) {
    if (!chatMessages) return;
    const div = document.createElement('div');
    div.className = `message ${type}`;
    const avatar = document.createElement('span');
    avatar.className = 'avatar';
    avatar.innerHTML = type === 'bot' ? '<i class="fas fa-robot"></i>' : '<i class="fas fa-user"></i>';
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    const lines = text.split('\n');
    lines.forEach((line, idx) => {
      bubble.appendChild(document.createTextNode(line));
      if (idx < lines.length - 1) bubble.appendChild(document.createElement('br'));
    });
    div.appendChild(avatar);
    div.appendChild(bubble);
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  };

  async function getSmartReply(msg) {
    try {
      const resp = await fetch(`${API_GATEWAY}?action=deepseek`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: msg }],
          max_tokens: 600,
          temperature: 0.7
        })
      });
      if (!resp.ok) throw new Error('API error');
      const json = await resp.json();
      if (json.success && json.data?.choices?.[0]?.message?.content) {
        return json.data.choices[0].message.content;
      }
    } catch (e) { console.warn('DeepSeek fallback:', e); }
    const lang = getLang();
    const t = TRANSLATIONS[lang] || TRANSLATIONS.vi;
    const lower = msg.toLowerCase();
    if (lower.includes('chào') || lower.includes('hi')) return t.ai_welcome || 'Xin chào! Tôi là AI của Thwih Music.';
    if (lower.includes('nhạc') || lower.includes('music')) return 'Bạn có thể tìm nhạc trong danh sách hoặc tải từ TikTok.';
    if (lower.includes('cảm ơn')) return 'Không có gì! Tôi luôn sẵn sàng giúp đỡ.';
    return 'Tôi chưa hiểu câu hỏi. Bạn có thể hỏi về âm nhạc, lập trình, hoặc kết nối mạng xã hội.';
  }

  if (chatToggle && chatBox && chatClose && chatInput && chatSend) {
    chatToggle.addEventListener('click', () => {
      chatBox.classList.toggle('active');
      if (chatBox.classList.contains('active')) {
        chatInput.focus();
        if (isFirstOpen) {
          const lang = getLang();
          const t = TRANSLATIONS[lang] || TRANSLATIONS.vi;
          setTimeout(() => window.appendMessage('bot', t.ai_welcome || 'Xin chào!'), 400);
          isFirstOpen = false;
        }
      }
    });
    chatClose.addEventListener('click', () => chatBox.classList.remove('active'));

    async function sendChat() {
      const text = chatInput.value.trim();
      if (!text) return;
      window.appendMessage('user', text);
      chatInput.value = '';
      const typingDiv = document.createElement('div');
      typingDiv.className = 'message bot typing';
      typingDiv.innerHTML = `<span class="avatar"><i class="fas fa-robot"></i></span><div class="bubble" style="min-width:60px;"><span class="typing-dots">.</span></div>`;
      chatMessages.appendChild(typingDiv);
      chatMessages.scrollTop = chatMessages.scrollHeight;
      let dots = 0;
      const interval = setInterval(() => {
        const span = typingDiv.querySelector('.typing-dots');
        if (span) { dots = (dots % 3) + 1; span.textContent = '.'.repeat(dots); }
      }, 400);
      try {
        const reply = await getSmartReply(text);
        clearInterval(interval);
        typingDiv.remove();
        window.appendMessage('bot', reply);
      } catch (e) {
        clearInterval(interval);
        typingDiv.remove();
        window.appendMessage('bot', '❌ Lỗi, vui lòng thử lại.');
      }
    }
    chatSend.addEventListener('click', sendChat);
    chatInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') sendChat(); });
  }
}