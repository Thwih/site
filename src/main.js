import './styles/main.css';
import './styles/components.css';
import './styles/themes.css';
import { initI18n, getTranslation } from './i18n.js';
import { MusicPlayer } from './player.js';
import { initTikTok } from './tiktok.js';
import { fetchSongs, shortenThrice } from './api.js';
import { showToast } from './utils.js';
import { generateStars, setupTheme, setupSidebar, setupBackToTop, setupClock, setupWelcome, setupModal, setupChat } from './utils.js';

// Khởi tạo các thành phần
document.addEventListener('DOMContentLoaded', () => {
  // 1. Ngôn ngữ
  initI18n();

  // 2. Hiệu ứng nền
  generateStars();

  // 3. Theme
  setupTheme();

  // 4. Sidebar
  setupSidebar();

  // 5. Back to top
  setupBackToTop();

  // 6. Đồng hồ
  setupClock();

  // 7. Welcome
  setupWelcome();

  // 8. Modal
  setupModal();

  // 9. Chat
  setupChat();

  // 10. Player
  window.player = new MusicPlayer();
  window.player.init();

  // 11. TikTok
  initTikTok();

  // 12. Tải danh sách nhạc
  loadSongs();

  // 13. Refresh button
  document.getElementById('refreshSongsBtn')?.addEventListener('click', loadSongs);
});

// Biến global để lưu danh sách bài hát
window.songData = [];

async function loadSongs() {
  const btn = document.getElementById('refreshSongsBtn');
  const icon = btn?.querySelector('i');
  const text = btn?.querySelector('span');
  if (btn) {
    icon?.classList.add('fa-spin');
    text.textContent = 'Đang cập nhật...';
    btn.style.opacity = '0.7';
    btn.style.pointerEvents = 'none';
  }
  try {
    const files = await fetchSongs();
    window.songData = files.map(f => ({ id: f.id, name: f.name, link: f.link }));
    renderSongs('');
    document.getElementById('songCountDisplay').textContent = `${window.songData.length} bài hát`;
    showToast(`Đã cập nhật ${window.songData.length} bài hát!`, 'success', 3000);
  } catch (error) {
    showToast('Không thể tải danh sách nhạc: ' + error.message, 'error', 5000);
  } finally {
    if (btn) {
      icon?.classList.remove('fa-spin');
      text.textContent = 'Làm mới';
      btn.style.opacity = '1';
      btn.style.pointerEvents = 'auto';
    }
  }
}

// Render danh sách bài hát
function renderSongs(filter = '') {
  const list = document.getElementById('songList');
  if (!list) return;
  const q = filter.trim().toLowerCase();
  const filtered = q ? window.songData.filter(s => s.name.toLowerCase().includes(q)) : window.songData;
  document.getElementById('songCountDisplay').textContent = `${filtered.length} bài hát`;
  if (filtered.length === 0) {
    list.innerHTML = `<div class="no-result"><i class="fas fa-music-slash"></i> Không tìm thấy bài hát nào</div>`;
    return;
  }
  let html = '';
  filtered.forEach((song, index) => {
    html += `
      <div class="song-item" data-link="${song.link}">
        <div class="left">
          <span class="stt">${index + 1}</span>
          <div class="info">
            <span class="name">${song.name}</span>
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
  list.querySelectorAll('.song-item').forEach(el => {
    const link = el.dataset.link;
    el.addEventListener('click', (e) => {
      if (e.target.closest('.actions')) return;
      handleSongClick(link, el);
    });
    el.querySelector('.download-btn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      handleSongClick(link, el);
    });
  });
}

// Xử lý click vào bài hát
let isProcessing = false;
async function handleSongClick(originalLink, element) {
  if (isProcessing) return;
  isProcessing = true;
  const nameEl = element.querySelector('.name');
  const originalText = nameEl.textContent;
  nameEl.innerHTML = `<span class="spinner-icon"><i class="fas fa-spinner"></i></span> Đang Tạo Link...`;
  nameEl.classList.add('loading');
  try {
    const finalLink = await shortenThrice(originalLink);
    window.open(finalLink, '_blank');
    showToast('Đã mở tab với link rút gọn!', 'success', 3000);
  } catch (error) {
    showToast('Lỗi tạo link: ' + error.message, 'error', 4000);
  } finally {
    setTimeout(() => {
      nameEl.textContent = originalText;
      nameEl.classList.remove('loading');
      isProcessing = false;
    }, 2000);
  }
}

// Tìm kiếm
document.getElementById('searchInput')?.addEventListener('input', function() {
  renderSongs(this.value);
  document.getElementById('clearSearch').classList.toggle('visible', this.value.length > 0);
});
document.getElementById('clearSearch')?.addEventListener('click', function() {
  document.getElementById('searchInput').value = '';
  renderSongs('');
  this.classList.remove('visible');
});