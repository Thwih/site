export function renderWelcome() {
  return `
    <div class="welcome-overlay" id="welcomeOverlay">
      <div class="galaxy-overlay"></div>
      <div class="welcome-box">
        <div class="loading-state" id="loadingState">
          <div class="spinner"></div>
          <div class="load-title" data-i18n="welcome_loading">Đang tải ứng dụng</div>
          <div class="load-sub"><span data-i18n="welcome_preparing">Chuẩn bị giao diện</span> <span class="dots">...</span> <span class="percent-display"><span class="num" id="loadPercent">0</span><span class="pct">%</span></span></div>
        </div>
        <div class="content-state" id="contentState">
          <img class="shop-logo" src="/src/assets/logo.png" alt="Thwih Logo" />
          <h2 data-i18n="welcome_title">Chào mừng bạn đến với Thwih</h2>
          <div class="shop-desc" data-i18n="welcome_desc"><strong>Nếu mọi người lấy Nhạc thì mọi người bấm</strong><br>vào các Liên Kết bên dưới để vào<br><strong>Group lấy nhạc nhé!</strong></div>
          <button class="btn-start" id="welcomeBtn"><i class="fas fa-check-circle"></i> <span data-i18n="welcome_btn">Đã Hiểu</span></button>
          <button class="close-noti" id="closeNotiBtn" data-i18n="welcome_close">Tắt Thông Báo</button>
        </div>
      </div>
    </div>
  `;
}