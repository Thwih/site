import { API_GATEWAY } from './config.js';
import { showToast, escapeHtml, truncateName } from './utils.js';

let songData = [];
let songMap = new Map();
let isFetching = false;

export async function fetchSongsFromDrive(showToastOnChange = true) {
    if (isFetching) return;
    isFetching = true;
    try {
        const response = await fetch(`${API_GATEWAY}?action=drive`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        if (!data.success) throw new Error(data.error || 'Worker error');
        if (!data.data || !Array.isArray(data.data.files)) {
            throw new Error('Invalid response format');
        }
        songMap.clear();
        data.data.files.forEach(file => {
            if (file.id && file.name && file.link) {
                songMap.set(file.id, { id: file.id, name: file.name, link: file.link });
            }
        });
        songData = Array.from(songMap.values());
        renderSongs('');
        const countEl = document.getElementById('songCountDisplay');
        if (countEl) countEl.textContent = `${songData.length} bài hát`;
        if (showToastOnChange) {
            showToast(`✅ Đã cập nhật ${songData.length} bài hát!`, 'success', 3000);
        }
    } catch (error) {
        console.error('Lỗi lấy danh sách nhạc:', error);
        if (showToastOnChange) {
            showToast('❌ Không thể tải danh sách nhạc. Vui lòng thử lại.', 'error', 5000);
        }
    } finally {
        isFetching = false;
    }
}

function renderSongs(filter = '') {
    const songListEl = document.getElementById('songList');
    const songCountDisplay = document.getElementById('songCountDisplay');
    if (!songListEl) return;
    const q = filter.trim().toLowerCase();
    const filtered = q ? songData.filter(s => s.name.toLowerCase().includes(q)) : songData;
    if (songCountDisplay) songCountDisplay.textContent = `${filtered.length} bài hát`;
    if (filtered.length === 0) {
        songListEl.innerHTML = `<div class="no-result"><i class="fas fa-music-slash"></i> Không tìm thấy bài hát nào</div>`;
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
    songListEl.innerHTML = html;
    // attach events
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

// handleSongClick cần import shortenThrice (hoặc dùng window)
async function handleSongClick(originalLink, element) {
    // ... (giống như trong code cũ, sử dụng window.shortenThrice)
    // Lưu ý: cần import shortenThrice từ shorten.js hoặc dùng window
}

export function initSongs() {
    const searchInput = document.getElementById('searchInput');
    const clearSearch = document.getElementById('clearSearch');
    const refreshBtn = document.getElementById('refreshSongsBtn');

    if (searchInput && clearSearch) {
        searchInput.addEventListener('input', function() {
            const val = this.value;
            renderSongs(val);
            clearSearch.classList.toggle('visible', val.length > 0);
        });
        clearSearch.addEventListener('click', function() {
            searchInput.value = '';
            renderSongs('');
            this.classList.remove('visible');
            searchInput.focus();
        });
    }
    if (refreshBtn) {
        refreshBtn.addEventListener('click', async function() {
            const icon = this.querySelector('i');
            const textSpan = this.querySelector('span');
            const originalText = textSpan.textContent;
            icon.classList.add('fa-spin');
            textSpan.textContent = 'Đang cập nhật...';
            this.style.opacity = '0.7';
            this.style.pointerEvents = 'none';
            await fetchSongsFromDrive(true);
            icon.classList.remove('fa-spin');
            textSpan.textContent = originalText;
            this.style.opacity = '1';
            this.style.pointerEvents = 'auto';
        });
    }
    fetchSongsFromDrive(true);
}