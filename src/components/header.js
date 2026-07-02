export function renderHeader() {
  return `
    <header class="app-header">
      <div class="header-left">
        <div class="menu-btn" id="menuBtn"><i class="fas fa-bars"></i></div>
        <span class="header-brand">Thwih</span>
      </div>
      <div class="header-right">
        <div class="header-bell" id="bellNotification"><i class="fas fa-bell"></i><span class="badge-dot" id="bellBadge">3</span></div>
        <div class="header-theme" id="themeToggle"><i class="fas fa-sun" id="themeIcon"></i></div>
        <div class="header-lang"><i class="fas fa-globe"></i><select id="langSelect"><option value="vi">VI</option><option value="en">EN</option></select></div>
      </div>
    </header>
  `;
}