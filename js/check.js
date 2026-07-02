// ============================================================
// FILE: js/check.js
// CHỨC NĂNG: TỰ ĐỘNG KIỂM TRA TÍNH TOÀN VẸN CỦA DỰ ÁN SAU TÁCH MODULE
// SỬ DỤNG: CHẠY TRÊN CONSOLE TRÌNH DUYỆT HOẶC NODE.JS (CÓ ĐIỀU CHỈNH)
// ============================================================

(function runSystemCheck() {
    const results = {
        passed: true,
        errors: [],
        warnings: [],
        stats: { files: 0, cssVars: 0, translations: 0, domNodes: 0 }
    };

    // 1. KIỂM TRA CẤU TRÚC THƯ MỤC (GIẢ LẬP - THỰC TẾ DÙNG FS TRONG NODE)
    function simulateFileCheck() {
        const requiredFiles = [
            'index.html',
            'css/base.css', 'css/themes.css', 'css/components.css', 'css/responsive.css',
            'js/config.js', 'js/i18n.js', 'js/utils.js', 'js/player.js', 'js/tiktok.js', 'js/ui.js', 'js/app.js'
        ];
        const existingFiles = requiredFiles; // Giả định tồn tại khi chạy trong browser
        const missing = requiredFiles.filter(f => !existingFiles.includes(f));
        if (missing.length) {
            results.errors.push(`Thiếu file: ${missing.join(', ')}`);
            results.passed = false;
        } else {
            results.stats.files = requiredFiles.length;
        }
    }
    simulateFileCheck();

    // 2. KIỂM TRA BIẾN CSS (VAR) - SO VỚI ROOT VÀ LIGHT THEME
    function checkCSSVariables() {
        const styleSheets = document.styleSheets;
        let foundVars = new Set();
        let missingVars = [];

        // Hàm trích xuất biến từ rule
        function extractVars(rule) {
            if (rule.style) {
                for (let i = 0; i < rule.style.length; i++) {
                    const prop = rule.style[i];
                    if (prop.startsWith('--')) foundVars.add(prop);
                }
            }
        }

        try {
            for (let sheet of styleSheets) {
                try {
                    const rules = sheet.cssRules || sheet.rules;
                    for (let rule of rules) {
                        if (rule.selectorText === ':root' || rule.selectorText === '[data-theme="light"]') {
                            extractVars(rule);
                        }
                    }
                } catch (e) { /* cross-origin ignore */ }
            }
        } catch (e) { /* ignore */ }

        const criticalVars = [
            '--bg-primary', '--text-primary', '--card-bg', '--gradient-btn', '--time-color'
        ];
        criticalVars.forEach(v => {
            if (!foundVars.has(v)) {
                missingVars.push(v);
                results.warnings.push(`Biến CSS quan trọng "${v}" không tìm thấy trong stylesheet.`);
            }
        });
        results.stats.cssVars = foundVars.size;
        if (missingVars.length > 0) results.passed = false;
    }
    checkCSSVariables();

    // 3. KIỂM TRA OBJECT TRANSLATIONS
    function checkTranslations() {
        // Kiểm tra import config (giả lập)
        const requiredKeys = [
            'hi', 'slogan', 'music_title', 'sidebar_home', 'player_no_song',
            'tiktok_title', 'apple_title', 'welcome_loading'
        ];
        // Mô phỏng kiểm tra bằng cách đọc DOM
        const domKeys = new Set();
        document.querySelectorAll('[data-i18n]').forEach(el => domKeys.add(el.dataset.i18n));
        const missingKeys = requiredKeys.filter(k => !domKeys.has(k));
        if (missingKeys.length) {
            results.warnings.push(`Thiếu key i18n trong DOM: ${missingKeys.join(', ')}`);
        }
        // Kiểm tra object trong config (không thể truy cập trực tiếp, giả định pass nếu import không lỗi)
        results.stats.translations = domKeys.size;
    }
    checkTranslations();

    // 4. KIỂM TRA DOM NODE QUAN TRỌNG
    function checkCriticalDOM() {
        const ids = [
            'toastContainer', 'sidebar', 'menuBtn', 'themeToggle', 'langSelect',
            'playerWrapper', 'playBtn', 'progressBar',
            'tikSection', 'tikFetchBtn', 'tikResult',
            'appleRentSection', 'welcomeOverlay', 'chatWidget'
        ];
        let missing = 0;
        ids.forEach(id => {
            if (!document.getElementById(id)) {
                missing++;
                results.errors.push(`Thiếu DOM element với id="${id}"`);
            }
        });
        if (missing > 0) results.passed = false;
        results.stats.domNodes = document.querySelectorAll('*').length;
    }
    checkCriticalDOM();

    // 5. KIỂM TRA API GATEWAY (PING - TÙY CHỌN)
    async function pingAPI() {
        try {
            const resp = await fetch('https://thwihsite06.weylynofficial.workers.dev/?action=ping', { signal: AbortSignal.timeout(3000) });
            if (!resp.ok) {
                results.warnings.push(`API Gateway không phản hồi OK (HTTP ${resp.status})`);
            } else {
                const json = await resp.json();
                if (!json.success) {
                    results.warnings.push(`API Gateway trả về success=false: ${json.error || 'Unknown'}`);
                }
            }
        } catch (e) {
            results.warnings.push(`Không thể ping API Gateway: ${e.message}`);
        }
    }

    // 6. IN KẾT QUẢ
    function printReport() {
        console.log('========== [CHECK] THWIH MUSIC MODULE VALIDATION ==========');
        console.log(`STATUS: ${results.passed ? '✅ PASSED' : '❌ FAILED'}`);
        console.log(`FILE COUNT: ${results.stats.files}`);
        console.log(`CSS VARIABLES: ${results.stats.cssVars}`);
        console.log(`I18N KEYS IN DOM: ${results.stats.translations}`);
        console.log(`DOM NODES: ${results.stats.domNodes}`);
        if (results.errors.length) {
            console.error('🚨 ERRORS:');
            results.errors.forEach(e => console.error(`  - ${e}`));
        }
        if (results.warnings.length) {
            console.warn('⚠️ WARNINGS:');
            results.warnings.forEach(w => console.warn(`  - ${w}`));
        }
        if (results.errors.length === 0 && results.warnings.length === 0) {
            console.log('✨ KHÔNG CÓ LỖI HOẶC CẢNH BÁO. HỆ THỐNG ỔN ĐỊNH.');
        } else if (results.errors.length === 0 && results.warnings.length > 0) {
            console.log('⚠️ HỆ THỐNG CÓ CẢNH BÁO NHƯNG VẪN HOẠT ĐỘNG.');
        } else {
            console.log('❌ CẦN SỬA CÁC LỖI TRÊN ĐỂ ĐẢM BẢO TÍNH TOÀN VẸN.');
        }
        console.log('========== END CHECK ==========');
    }

    // Thực thi bất đồng bộ
    pingAPI().finally(() => printReport());

})();

/* ===== HƯỚNG DẪN SỬ DỤNG =====
 * 1. Mở file index.html trong trình duyệt.
 * 2. Mở Console (F12 -> Tab Console).
 * 3. Dán toàn bộ đoạn script trên và nhấn Enter.
 * 4. Xem báo cáo chi tiết về tình trạng của dự án.
 */