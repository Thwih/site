// CÔNG TẮC BẢO TRÌ TOÀN BỘ WEBSITE: true (Bật bảo trì) / false (Tắt bảo trì)
const FULL_MAINTENANCE_MODE = false; 

// --- HỆ THỐNG BẢO TRÌ TOÀN BỘ WEB ---
if (FULL_MAINTENANCE_MODE === true) {
    document.body.innerHTML = `
      <style>
        body, html { margin: 0; padding: 0; height: 100%; overflow: hidden; background: #f4f7ff; font-family: 'Nunito', sans-serif; }
        .maint-wrap { position: fixed; inset: 0; z-index: 99999; display: flex; align-items: center; justify-content: center; padding: 20px; }
        .maint-box { background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(30px) saturate(180%); -webkit-backdrop-filter: blur(30px) saturate(180%); border: 1px solid rgba(255, 255, 255, 0.9); border-radius: 30px; padding: 50px 40px; max-width: 480px; width: 100%; text-align: center; box-shadow: 0 30px 80px rgba(140, 85, 250, 0.15); animation: fadeUp 0.6s cubic-bezier(0.2, 0.8, 0.2, 1); }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .maint-icon { width: 80px; height: 80px; margin: 0 auto 25px; border-radius: 50%; display: grid; place-items: center; color: #fff; font-size: 32px; background: linear-gradient(135deg, #8c55fa, #4263eb); box-shadow: 0 15px 35px rgba(140, 85, 250, 0.3); animation: shake 2s infinite; }
        @keyframes shake { 0%, 100% { transform: rotate(0deg); } 25% { transform: rotate(-10deg); } 75% { transform: rotate(10deg); } }
        .maint-box h1 { font-family: 'Quicksand', sans-serif; font-size: 28px; font-weight: 700; color: #000; margin: 0 0 15px; }
        .maint-box p { font-size: 15px; line-height: 1.6; color: #333; margin: 0 0 20px; font-weight: 500; }
        .maint-btn { display: inline-flex; align-items: center; gap: 8px; margin-top: 10px; padding: 12px 25px; border-radius: 15px; background: rgba(140, 85, 250, 0.1); border: 1px solid rgba(140, 85, 250, 0.3); color: #6d28d9; text-decoration: none; font-weight: 700; font-family: 'Quicksand', sans-serif; transition: 0.3s; }
        .maint-btn:hover { background: #8c55fa; color: #fff; transform: translateY(-2px); }
      </style>
      <div class="maint-wrap">
        <div class="maint-box">
          <div class="maint-icon"><i class="fa-solid fa-screwdriver-wrench"></i></div>
          <h1>Website Đang Bảo Trì</h1>
          <p>Chúng tôi đang tiến hành nâng cấp và bảo trì hệ thống để mang đến trải nghiệm tốt nhất. Vui lòng quay lại sau ít phút nữa!</p>
          <p>Nếu cần hỗ trợ gấp, hãy liên hệ Telegram:</p>
          <a href="https://t.me/thwihmod" target="_blank" class="maint-btn"><i class="fa-brands fa-telegram"></i> @thwihmod</a>
        </div>
      </div>
    `;
    throw new Error("Website is under maintenance. Stopping script execution."); 
}

// --- DỮ LIỆU ỨNG DỤNG MOD ---
const appsData = [
    {
        os: "android",
        banner: "https://i.postimg.cc/WbrMZCN1/2DCBCE39-95A9-4090-A894-A34948A2A9B9.png",
        icon: "https://i.postimg.cc/D0NBzXPj/IMG-1747.jpg",
        title: "WOLFSIGHT ROOT 1.2",
        date: "Cập Nhật Ngày 5/8",
        status: "active", // "active" (An toàn), "update" (Đang cập nhật), "error" (Bị lỗi)
        desc: "Phiên bản: External v1.2, Aimbot, Esp, Antiband, Hỗ trợ all ngôn ngữ. Thiết bị chưa root có thể sử dụng máy ảo.",
        downloadUrl: "https://www.mediafire.com/file/3i4neptme76kdq2/WolfSight+External+v1.2.apk/file",
        keyUrl: "https://getkey.vuahackvip.com/",
        fallback: "https://t.me/thwihmod"
    },
    {  
        os: "android",
        banner: "https://i.postimg.cc/4d7KgHn1/672DBDF6-0BA1-46EE-9B68-FC967202A945.png",
        icon: "https://i.postimg.cc/D0NBzXPj/IMG-1747.jpg",
        title: "YSM TEAM V6",
        date: "Cập Nhật Ngày 4/8",
        status: "update",
        desc: "YSM Team V6 cho Android. Tối ưu hóa độ giật, tăng độ chính xác. Không cần Root.",
        downloadUrl: "https://link-tai-xuong-cua-ban.com/ysm",
        keyUrl: "https://link-lay-key-cua-ban.com/ysm",
        fallback: "https://t.me/thwihmod"
    },
    {
        os: "android",
        banner: "https://i.postimg.cc/tJRvmbBs/5486F7DB-F9E0-41C7-AE40-F8CE5A1B2BE2.png",
        icon: "https://i.postimg.cc/D0NBzXPj/IMG-1747.jpg",
        title: "WOLFSIGHT ROOT",
        date: "Cập Nhật Ngày 4/8",
        status: "error",
        desc: "Wolfsight Root cho Android. Mod Menu mạnh mẽ, yêu cầu máy đã Root. Auto Headshot, ESP.",
        downloadUrl: "https://link-tai-xuong-cua-ban.com/wolfsight",
        keyUrl: "https://link-lay-key-cua-ban.com/wolfsight",
        fallback: "https://t.me/thwihmod"
    }
];

// --- DỮ LIỆU RIÊNG CHO ACC LIÊN QUÂN FREE ---
const lqAccData = {
    banner: "https://i.postimg.cc/4d7KgHn1/672DBDF6-0BA1-46EE-9B68-FC967202A945.png",
    icon: "https://i.postimg.cc/D0NBzXPj/IMG-1747.jpg",
    title: "Acc Liên Quân Random",
    desc: "Tài khoản ngẫu nhiên, mỗi acc chỉ có 1 người nhận duy nhất. Bốc ngay để nhận acc của bạn!"
};

// --- HỆ THỐNG TỰ ĐỘNG HIỂN THỊ ---
window.addEventListener('DOMContentLoaded', () => {
    const allGrid = document.querySelector('#grid-all .apps-grid');
    const androidGrid = document.querySelector('#grid-android .apps-grid');
    const iosGrid = document.querySelector('#grid-ios .apps-grid');

    if (!allGrid) return;

    // 1. RENDER CÁC ỨNG DỤNG MOD
    appsData.forEach(app => {
        const osName = app.os === 'ios' ? 'iOS' : 'Android';
        
        // Xử lý trạng thái Mod và Icon tương ứng
        let statusText = '';
        let statusClass = '';
        let statusIcon = '';
        if (app.status === 'active') {
            statusText = 'An Toàn'; statusClass = 'active'; statusIcon = 'fa-circle-check';
        } else if (app.status === 'update') {
            statusText = 'Cập Nhật'; statusClass = 'update'; statusIcon = 'fa-wrench';
        } else if (app.status === 'error') {
            statusText = 'Bị Lỗi'; statusClass = 'error'; statusIcon = 'fa-bug';
        }

        const cardHTML = `
            <div class="app-card reveal" data-desc="${app.desc}">
                <div class="card-banner">
                    <img src="${app.banner}" alt="${app.title}" loading="lazy">
                    <span class="dynamic-badge ${app.os} showing-os" 
                          data-os="${osName}" 
                          data-status="${statusClass}" 
                          data-status-text="${statusText}" 
                          data-status-icon="${statusIcon}">
                      <i class="fa-brands fa-${app.os}"></i> ${osName}
                    </span>
                </div>
                <div class="app-info">
                    <div class="app-header">
                        <div class="app-icon-small"><img src="${app.icon}" alt="Icon" loading="lazy"></div>
                        <div class="app-info-text"><h3>${app.title}</h3><div class="update-date">${app.date}</div></div>
                    </div>
                    <div class="app-btns">
                        <button class="app-btn primary" data-url="${app.downloadUrl}" data-fallback="${app.fallback}"><i class="fa-solid fa-download"></i> Tải Xuống</button>
                        <button class="app-btn secondary" data-url="${app.keyUrl}" data-fallback="${app.fallback}"><i class="fa-solid fa-key"></i> Get Key</button>
                    </div>
                </div>
            </div>
        `;
        allGrid.innerHTML += cardHTML;
        if (app.os === 'android') androidGrid.innerHTML += cardHTML;
        if (app.os === 'ios') iosGrid.innerHTML += cardHTML;
    });

    // 2. RENDER THẺ ACC LIÊN QUÂN FREE VÀO TRANG RIÊNG
    const lqGrid = document.querySelector('.lq-grid-center');
    if (lqGrid) {
        lqGrid.innerHTML = `
            <div class="app-card reveal" data-desc="${lqAccData.desc}">
                <div class="card-banner">
                    <img src="${lqAccData.banner}" alt="Acc Liên Quân Free" loading="lazy">
                    <span class="os-badge android"><i class="fa-solid fa-gem"></i> Free</span>
                </div>
                <div class="app-info">
                    <div class="app-header">
                        <div class="app-icon-small"><img src="${lqAccData.icon}" alt="Icon" loading="lazy"></div>
                        <div class="app-info-text">
                            <h3>${lqAccData.title}</h3>
                            <div class="lq-count" id="lq-acc-count">Đang kiểm tra kho...</div>
                        </div>
                    </div>
                    <div class="app-btns">
                        <button class="app-btn lq-acc-btn" onclick="getFreeLQAccount()" style="flex: 1;">
                            <i class="fa-solid fa-wand-magic-sparkles"></i> Bốc Acc Ngay
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
});