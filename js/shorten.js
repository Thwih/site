/**
 * shorten.js – Module rút gọn link (3 lần, có cache)
 * Dùng chung cho toàn bộ ứng dụng Thwih Music
 */

// ===== CẤU HÌNH =====
const API_GATEWAY = 'https://thwihsite06.weylynofficial.workers.dev/';
const CACHE_KEY = 'shorten_cache_v8';

// ===== CACHE =====
function getCache() {
    try {
        return JSON.parse(localStorage.getItem(CACHE_KEY)) || {};
    } catch {
        return {};
    }
}

function setCache(originalUrl, shortenedUrl) {
    const cache = getCache();
    cache[originalUrl] = shortenedUrl;
    try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
    } catch (e) { /* bỏ qua lỗi storage */ }
}

// ===== GỌI API RÚT GỌN 1 LẦN =====
async function shortenOnce(url) {
    const resp = await fetch(`${API_GATEWAY}?action=shorten&url=${encodeURIComponent(url)}`);
    if (!resp.ok) {
        const err = await resp.json();
        throw new Error(err.error || `HTTP ${resp.status}`);
    }
    const json = await resp.json();
    if (!json.success || !json.data || !json.data.shortenedUrl) {
        throw new Error('Worker trả về dữ liệu không hợp lệ');
    }
    return json.data.shortenedUrl;
}

// ===== RÚT GỌN 3 LẦN (CÓ CACHE) =====
export async function shortenThrice(originalUrl) {
    // Kiểm tra cache
    const cache = getCache();
    if (cache[originalUrl]) return cache[originalUrl];

    try {
        let currentUrl = originalUrl;
        // Lần 1
        currentUrl = await shortenOnce(currentUrl);
        // Lần 2
        currentUrl = await shortenOnce(currentUrl);
        // Lần 3
        currentUrl = await shortenOnce(currentUrl);

        // Lưu cache
        setCache(originalUrl, currentUrl);
        return currentUrl;
    } catch (error) {
        console.error('Lỗi rút gọn link, fallback về link gốc:', error);
        return originalUrl;
    }
}

// ===== HÀM TIỆN ÍCH CHO HIỂN THỊ TIẾN TRÌNH (TÙY CHỌN) =====
export function createProgressPage(title = 'Đang tạo link...') {
    // Mở tab mới và hiển thị giao diện loading
    const newTab = window.open('', '_blank');
    if (!newTab) {
        alert('Trình duyệt chặn pop-up! Vui lòng cho phép để tạo link.');
        return null;
    }
    newTab.document.write(`
        <html><head><title>${title}</title>
        <style>
            *{margin:0;padding:0;box-sizing:border-box}
            body{font-family:'Segoe UI',system-ui,sans-serif;display:flex;justify-content:center;align-items:center;min-height:100vh;background:radial-gradient(ellipse at 30% 20%, #0d1a2e 0%, #080f1a 40%, #040810 80%);color:#e8f0f8;padding:20px;margin:0}
            .lp-container{max-width:400px;width:100%;background:rgba(15,30,50,0.6);backdrop-filter:blur(40px);-webkit-backdrop-filter:blur(40px);border-radius:3rem;padding:2rem 1.6rem 1.8rem;border:1px solid rgba(100,180,255,0.10);box-shadow:0 25px 50px -8px rgba(0,0,0,0.9);text-align:center}
            .lp-icon{font-size:3.6rem;margin-bottom:0.4rem}
            .spinner-ring{width:52px;height:52px;border-radius:50%;border:4px solid rgba(74,158,255,0.08);border-top-color:#4a9eff;animation:spin 0.9s cubic-bezier(0.6,0.2,0.4,0.8) infinite}
            @keyframes spin{to{transform:rotate(360deg)}}
            .lp-title{font-size:1.6rem;font-weight:700;background:linear-gradient(to right, #00d2d3, #4a9eff, #6c5ce7);background-size:300% 100%;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:grad 4s ease-in-out infinite;letter-spacing:0.5px}
            @keyframes grad{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
            .lp-bar-wrap{margin:1.2rem 0 0.6rem}
            .lp-bar{width:100%;height:6px;border-radius:10px;background:rgba(100,180,255,0.10);overflow:hidden}
            .lp-bar .fill{height:100%;width:0%;border-radius:10px;background:linear-gradient(90deg, #00d2d3, #4a9eff, #6c5ce7);background-size:200% 100%;animation:shimmer 1.8s ease-in-out infinite;transition:width 0.3s ease}
            @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
            .lp-progress-text{display:flex;justify-content:space-between;font-size:0.7rem;color:#8aaac0;font-weight:500;margin-top:4px}
            .lp-progress-text .percent{color:#4a9eff;font-weight:700}
            .step-label{font-size:0.8rem;color:#8aaac0;margin-top:0.5rem;letter-spacing:0.5px}
            .step-label .highlight{color:#4a9eff;font-weight:600}
            .lp-footer{margin-top:0.8rem;font-size:0.75rem;color:#8aaac0;border-top:1px solid rgba(100,180,255,0.06);padding-top:0.8rem;display:flex;align-items:center;justify-content:center;gap:10px}
            .lp-footer .brand{font-weight:700;background:linear-gradient(to right, #00d2d3, #4a9eff, #6c5ce7);background-size:300% 100%;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:grad 4s ease-in-out infinite}
            @media(max-width:500px){.lp-container{padding:1.6rem 1.2rem 1.4rem;border-radius:2rem}.lp-title{font-size:1.3rem}.lp-icon .spinner-ring{width:42px;height:42px;border-width:3px}}
        </style>
        </head><body>
        <div class="lp-container">
            <div class="lp-icon"><div class="spinner-ring"></div></div>
            <div class="lp-title">${title}</div>
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
    newTab.document.title = title;
    return newTab;
}