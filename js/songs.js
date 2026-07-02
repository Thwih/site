import { API_GATEWAY } from './config.js';
import { showToast, escapeHtml, truncateName, shortenThrice } from './utils.js';
import { applyLanguage } from './translations.js';

let songData = [];
let songMap = new Map();
let isFetching = false;
let isProcessing = false;

export async function fetchSongsFromDrive(showToastOnChange = true) {
    if (isFetching) return;
    isFetching = true;
    try {
        const response = await fetch(`${API_GATEWAY}?action=drive`);
        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error || `HTTP ${response.status}`);
        }
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
            showToast(` Đã cập nhật ${songData.length} bài hát!`, 'success', 3000);
        }
    } catch (error) {
        console.error('Lỗi lấy danh sách nhạc:', error);
        if (showToastOnChange) {
            showToast('Không thể tải danh sách nhạc. Vui lòng thử lại.', 'error', 5000);
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
    songCountDisplay.textContent = `${filtered.length} bài hát`;
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
                    body{font-family:'Segoe UI',system-ui,sans-serif;display:flex;justify-content:center;align-items:center;min-height:100vh;background:radial-gradient(ellipse at 30% 20%, #0d1a2e 0%, #080f1a 40%, #040810 80%);color:#e8f0f8;padding:20px;margin:0;}
                    .lp-container{max-width:400px;width:100%;background:rgba(15,30,50,0.6);backdrop-filter:blur(40px);-webkit-backdrop-filter:blur(40px);border-radius:3rem;padding:2rem 1.6rem 1.8rem;border:1px solid rgba(100,180,255,0.10);box-shadow:0 25px 50px -8px rgba(0,0,0,0.9);text-align:center;}
                    .lp-icon{font-size:3.6rem;margin-bottom:0.4rem;}
                    .spinner-ring{width:52px;height:52px;border-radius:50%;border:4px solid rgba(74,158,255,0.08);border-top-color:#4a9eff;animation:spin 0.9s cubic-bezier(0.6,0.2,0.4,0.8) infinite;}
                    @keyframes spin{to{transform:rotate(360deg);}}
                    .lp-title{font-size:1.6rem;font-weight:700;background:linear-gradient(to right, #00d2d3, #4a9eff, #6c5ce7);background-size:300% 100%;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:grad 4s ease-in-out infinite;letter-spacing:0.5px;}
                    @keyframes grad{0%{background-position:0% 50%;}50%{background-position:100% 50%;}100%{background-position:0% 50%;}}
                    .lp-bar-wrap{margin:1.2rem 0 0.6rem;}
                    .lp-bar{width:100%;height:6px;border-radius:10px;background:rgba(100,180,255,0.10);overflow:hidden;}
                    .lp-bar .fill{height:100%;width:0%;border-radius:10px;background:linear-gradient(90deg, #00d2d3, #4a9eff, #6c5ce7);background-size:200% 100%;animation:shimmer 1.8s ease-in-out infinite;transition:width 0.3s ease;}
                    @keyframes shimmer{0%{background-position:-200% 0;}100%{background-position:200% 0;}}
                    .lp-progress-text{display:flex;justify-content:space-between;font-size:0.7rem;color:#8aaac0;font-weight:500;margin-top:4px;}
                    .lp-progress-text .percent{color:#4a9eff;font-weight:700;}
                    .lp-footer{margin-top:0.8rem;font-size:0.75rem;color:#8aaac0;border-top:1px solid rgba(100,180,255,0.06);padding-top:0.8rem;display:flex;align-items:center;justify-content:center;gap:10px;}
                    .lp-footer .brand{font-weight:700;background:linear-gradient(to right, #00d2d3, #4a9eff, #6c5ce7);background-size:300% 100%;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:grad 4s ease-in-out infinite;}
                    .lp-footer i{color:#4a9eff;font-size:0.65rem;}
                    .step-label{font-size:0.8rem;color:#8aaac0;margin-top:0.5rem;letter-spacing:0.5px;}
                    .step-label .highlight{color:#4a9eff;font-weight:600;}
                    @media(max-width:500px){.lp-container{padding:1.6rem 1.2rem 1.4rem;border-radius:2rem;}.lp-title{font-size:1.3rem;}.lp-icon .spinner-ring{width:42px;height:42px;border-width:3px;}}
                </style>
                </head><body>
                <div class="lp-container">
                    <div class="lp-icon"><div class="spinner-ring"></div></div>
                    <div class="lp-title">Đang tạo link</div>
                    <div class="lp-bar-wrap"><div class="lp-bar"><div class="fill" id="lpFillTab" style="width:0%;"></div></div>
                    <div class="lp-progress-text"><span id="lpLabelTab">Đang xử lý...</span><span class="percent" id="lpPercentTab">0%</span></div></div>
                    <div class="step-label" id="stepLabelTab">🔹 <span class="highlight">Lần 1:</span> Đang rút gọn...</div>
                    <div class="lp-footer"><i class="fas fa-music"></i><span class="brand">Thwih</span></div>
                </div>
                <script>
                    window.updateProgress = function(pct, stepMsg) {
                        const fill=document.getElementById('lpFillTab'), label=document.getElementById('lpLabelTab'), percent=document.getElementById('lpPercentTab'), stepLabel=document.getElementById('stepLabelTab');
                        if(fill) fill.style.width=Math.min(pct,100)+'%';
                        if(percent) percent.textContent=Math.round(Math.min(pct,100))+'%';
                        if(label && stepMsg) label.textContent=stepMsg;
                        if(stepLabel){
                            if(pct<=33) stepLabel.innerHTML='🔹 <span class="highlight">Lần 1:</span> Đang rút gọn...';
                            else if(pct<=66) stepLabel.innerHTML='🔸 <span class="highlight">Lần 2:</span> Đang rút gọn...';
                            else if(pct<100) stepLabel.innerHTML='🔹 <span class="highlight">Lần 3:</span> Đang rút gọn...';
                            else stepLabel.innerHTML=' <span class="highlight">Hoàn tất!</span> Chuyển hướng...';
                        }
                    };
                <\/script>
                </body></html>
            `);
            newTab.document.title = 'Đang tạo link...';
        } else {
            showToast(' Pop-up bị chặn!', 'error', 4000);
        }
    } catch (e) { console.warn('Không thể mở tab mới:', e); }

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
            showToast(' Đã mở tab với link rút gọn!', 'success', 3000);
        }, 3000);
    } catch (error) {
        console.error('Lỗi:', error);
        showToast('❌ Đã xảy ra lỗi, vui lòng thử lại!', 'error', 4000);
        if (newTab && !newTab.closed) { try { newTab.updateProgress(100, '❌ Lỗi: ' + error.message);
                setTimeout(() => { if (!newTab.closed) newTab.close(); }, 2000); } catch (e) { newTab.close(); } }
    } finally {
        setTimeout(() => {
            nameEl.textContent = originalText;
            nameEl.classList.remove('loading', 'error');
            element.style.pointerEvents = '';
            if (downloadBtn) downloadBtn.style.pointerEvents = '';
            isProcessing = false;
        }, 3000);
    }
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
    setInterval(() => fetchSongsFromDrive(false), 60000);
}