import { API_GATEWAY } from './config.js';
import { showToast, escapeHtml, truncateName } from './utils.js';

let songData = [];
let songMap = new Map();
let isFetching = false;

export async function fetchSongsFromDrive(showToastOnChange = true) {
    if (isFetching) return;
    isFetching = true;
    try {
        console.log('🔍 Đang gọi API:', `${API_GATEWAY}?action=drive`);
        const response = await fetch(`${API_GATEWAY}?action=drive`);
        console.log('📡 Response status:', response.status);
        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error || `HTTP ${response.status}`);
        }
        const data = await response.json();
        console.log('📦 Dữ liệu nhận được:', data);
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
            showToast(`Đã cập nhật ${songData.length} bài hát!`, 'success', 3000);
        }
    } catch (error) {
        console.error('❌ Lỗi lấy danh sách nhạc:', error);
        if (showToastOnChange) {
            showToast('❌ Không thể tải danh sách nhạc. Vui lòng thử lại.', 'error', 5000);
        }
    } finally {
        isFetching = false;
    }
}

// ... các hàm renderSongs, handleSongClick (giữ nguyên)