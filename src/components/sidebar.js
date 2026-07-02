export function renderSidebar() {
  return `
    <div class="menu-overlay" id="menuOverlay"></div>
    <nav class="sidebar" id="sidebar">
      <div class="sidebar-header">
        <span class="brand">Thwih Music</span>
        <button class="close-btn" id="sidebarClose"><i class="fas fa-times"></i></button>
      </div>
      <div class="sidebar-body">
        <a href="#menuCard" class="sidebar-link" data-i18n="sidebar_home" onclick="closeSidebar()"><i class="fas fa-home"></i> <span>Trang chủ</span></a>
        <a href="#musicSection" class="sidebar-link" data-i18n="sidebar_music" onclick="closeSidebar()"><i class="fas fa-music"></i> <span>Lấy nhạc miễn phí</span></a>
        <a href="#searchSection" class="sidebar-link" data-i18n="sidebar_search" onclick="closeSidebar()"><i class="fas fa-search"></i> <span>Tìm kiếm nhạc</span></a>
        <a href="#tikSection" class="sidebar-link" data-i18n="sidebar_tiktok" onclick="closeSidebar()"><i class="fas fa-download"></i> <span>Tải Video MP3, MP4</span></a>
        <a href="#appleRentSection" class="sidebar-link" data-i18n="sidebar_apple" onclick="closeSidebar()"><i class="fab fa-apple"></i> <span>Thuê ID Apple</span></a>
        <div class="sidebar-divider"></div>
        <div class="sidebar-subtitle" data-i18n="sidebar_connect">Kết nối</div>
        <a href="https://www.tiktok.com/@thwih1" target="_blank" class="sidebar-link"><i class="fab fa-tiktok"></i> TikTok</a>
        <a href="https://t.me/thwihmusic" target="_blank" class="sidebar-link"><i class="fab fa-telegram-plane"></i> Telegram</a>
        <a href="https://zalo.me/g/otroe2pxpnitzfr6hppg" target="_blank" class="sidebar-link"><i class="fas fa-comment-dots"></i> Zalo Group</a>
        <div class="sidebar-divider"></div>
        <div class="sidebar-subtitle" data-i18n="sidebar_settings">Cài đặt</div>
        <div class="sidebar-link" id="sidebarThemeToggle"><i class="fas fa-palette"></i> <span data-i18n="sidebar_theme">Chế độ sáng/tối</span></div>
        <div class="sidebar-link" onclick="toggleSidebarLanguage()"><i class="fas fa-globe"></i> <span data-i18n="sidebar_lang">Đổi ngôn ngữ (VI/EN)</span></div>
      </div>
    </nav>
  `;
}