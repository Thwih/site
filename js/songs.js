import { API_GATEWAY } from './config.js';
import { showToast, escapeHtml, truncateName } from './utils.js';
import { shortenThrice, createProgressPage } from './shorten.js';

let songData = [];
let songMap = new Map();
let isFetching = false;
let isProcessing = false;

export async function fetchSongsFromDrive(showToastOnChange = true) {
    // ... (giữ nguyên)
}

function renderSongs(filter = '') {
    // ... (giữ nguyên)
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

    const newTab = createProgressPage('Đang tạo link...');

    try {
        const finalLink = await shortenThrice(originalLink);
        let progress = 0;
        const interval = setInterval(() => {
            if (newTab && !newTab.closed) {
                if (progress < 90) { progress += Math.random() * 5 + 2; if (progress > 90) progress = 90;
                    newTab.updateProgress(progress); }
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
            showToast('Đã mở tab với link rút gọn!', 'success', 3000);
        }, 3000);
    } catch (error) {
        console.error(error);
        showToast('❌ Lỗi, vui lòng thử lại!', 'error', 4000);
        if (newTab && !newTab.closed) newTab.close();
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

export function initSongs() {
    // ... (giữ nguyên sự kiện tìm kiếm, làm mới)
}