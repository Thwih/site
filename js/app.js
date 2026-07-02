import { API_GATEWAY } from './config.js';
import { applyLanguage, getLang } from './i18n.js';
import { showToast, shortenThrice, escapeHtml, truncateName } from './utils.js';
import { MusicPlayer } from './player.js';
import { TikTokDownloader } from './tiktok.js';
import { initUI } from './ui.js';

let songData = [];
let songMap = new Map();
let isFetching = false;

async function fetchSongs(showToastOnChange = true) {
  if (isFetching) return;
  isFetching = true;
  try {
    const resp = await fetch(`${API_GATEWAY}?action=drive`);
    if (!resp.ok) { const e = await resp.json(); throw new Error(e.error || `HTTP ${resp.status}`); }
    const json = await resp.json();
    if (!json.success || !json.data?.files) throw new Error('Invalid response');
    songMap.clear();
    json.data.files.forEach(file => {
      if (file.id && file.name && file.link) {
        songMap.set(file.id, { id: file.id, name: file.name, link: file.link });
      }
    });
    songData = Array.from(songMap.values());
    renderSongs('');
    const countEl = document.getElementById('songCountDisplay');
    if (countEl) countEl.textContent = `${songData.length} bài hát`;
    if (showToastOnChange) showToast(` Đã cập nhật ${songData.length} bài hát!`, 'success', 3000);
  } catch (e) {
    console.error('Fetch songs error:', e);
    if (showToastOnChange) showToast('Không thể tải danh sách nhạc.', 'error', 5000);
  } finally {
    isFetching = false;
  }
}

function renderSongs(filter = '') {
  const list = document.getElementById('songList');
  const count = document.getElementById('songCountDisplay');
  if (!list) return;
  const q = filter.trim().toLowerCase();
  const filtered = q ? songData.filter(s => s.name.toLowerCase().includes(q)) : songData;
  if (count) count.textContent = `${filtered.length} bài hát`;
  if (filtered.length === 0) {
    list.innerHTML = `<div class="no-result"><i class="fas fa-music-slash"></i> Không tìm thấy bài hát nào</div>`;
    return;
  }
  let html = '';
  filtered.forEach((song, index) => {
    const displayName = truncateName(song.name, 55);
    html += `
      <div class="song-item" data-link="${escapeHtml(song.link)}">
        <div class="left">
          <span class="stt">${index+1}</span>
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
  list.innerHTML = html;
  // Attach click events
  list.querySelectorAll('.song-item').forEach(el => {
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

let isProcessing = false;
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
      newTab.document.write(`<!DOCTYPE html><html><head><title>Đang tạo link...</title><style>body{background:#0d1a2e;color:#e8f0f8;display:flex;justify-content:center;align-items:center;height:100vh;font-family:sans-serif;margin:0;text-align:center;}.spinner{width:50px;height:50px;border:4px solid rgba(255,255,255,0.1);border-top-color:#4a9eff;border-radius:50%;animation:spin 0.8s linear infinite;margin:20px auto;}@keyframes spin{to{transform:rotate(360deg);}}.title{font-size:1.5rem;font-weight:bold;background:linear-gradient(to right,#00d2d3,#4a9eff,#6c5ce7);-webkit-background-clip:text;-webkit-text-fill-color:transparent;}.progress{width:80%;height:6px;background:rgba(255,255,255,0.1);border-radius:10px;margin:20px auto;overflow:hidden;}.fill{width:0%;height:100%;background:linear-gradient(to right,#00d2d3,#4a9eff);transition:width 0.3s;}</style></head><body><div><div class="spinner"></div><div class="title">Đang tạo link</div><div class="progress"><div class="fill" id="lpFill"></div></div><p id="lpLabel" style="color:#8aaac0;">Đang xử lý...</p></div><script>window.updateProgress=function(pct,msg){document.getElementById('lpFill').style.width=Math.min(pct,100)+'%';if(msg)document.getElementById('lpLabel').textContent=msg;};<\/script></body></html>`);
    }
  } catch (e) { console.warn('Popup blocked:', e); }

  try {
    const finalLink = await shortenThrice(originalLink);
    let progress = 0;
    const interval = setInterval(() => {
      if (newTab && !newTab.closed) {
        if (progress < 90) { progress += Math.random()*5+2; if (progress>90) progress=90; newTab.updateProgress(progress); }
      }
    }, 300);
    setTimeout(() => {
      clearInterval(interval);
      if (newTab && !newTab.closed) {
        newTab.updateProgress(100, 'Hoàn tất! Chuyển hướng...');
        setTimeout(() => { if (!newTab.closed) newTab.location.href = finalLink; }, 500);
      } else {
        window.open(finalLink, '_blank');
      }
      showToast(' Đã mở tab với link rút gọn!', 'success', 3000);
    }, 3000);
  } catch (error) {
    console.error(error);
    showToast('❌ Lỗi, vui lòng thử lại!', 'error', 4000);
    if (newTab && !newTab.closed) { try { newTab.updateProgress(100, '❌ Lỗi'); setTimeout(() => newTab.close(), 2000); } catch(e) { newTab.close(); } }
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

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  // UI
  initUI();
  // Language
  applyLanguage(getLang());
  // Player
  window.player = new MusicPlayer();
  // TikTok
  window.tikTok = new TikTokDownloader();
  // Fetch songs
  fetchSongs(true);
  // Auto refresh every 60s
  setInterval(() => fetchSongs(false), 60000);

  // Refresh button
  const refreshBtn = document.getElementById('refreshSongsBtn');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', async function() {
      const icon = this.querySelector('i');
      const text = this.querySelector('span');
      const origText = text.textContent;
      icon.classList.add('fa-spin');
      text.textContent = 'Đang cập nhật...';
      this.style.opacity = '0.7';
      this.style.pointerEvents = 'none';
      await fetchSongs(true);
      icon.classList.remove('fa-spin');
      text.textContent = origText;
      this.style.opacity = '1';
      this.style.pointerEvents = 'auto';
    });
  }

  // Search
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

  console.log('Ứng dụng đã sẵn sàng.');
  console.log('🔗 API Gateway:', API_GATEWAY);
});