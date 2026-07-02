export function initSidebar() {
  const menuBtn = document.getElementById('menuBtn');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('menuOverlay');
  const closeBtn = document.getElementById('sidebarClose');

  function openSidebar() {
    if (sidebar && overlay) {
      sidebar.classList.add('active');
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }
  window.closeSidebar = function() {
    if (sidebar && overlay) {
      sidebar.classList.remove('active');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  };
  if (menuBtn) menuBtn.addEventListener('click', openSidebar);
  if (closeBtn) closeBtn.addEventListener('click', window.closeSidebar);
  if (overlay) overlay.addEventListener('click', window.closeSidebar);

  // Theme toggle trong sidebar
  const themeToggle = document.getElementById('sidebarThemeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', function() {
      const html = document.documentElement;
      const newTheme = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      const icon = document.getElementById('themeIcon');
      if (icon) icon.className = newTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
      window.closeSidebar();
    });
  }

  window.toggleSidebarLanguage = function() {
    const langSelect = document.getElementById('langSelect');
    if (!langSelect) return;
    const currentLang = localStorage.getItem('lang') || 'vi';
    const newLang = currentLang === 'vi' ? 'en' : 'vi';
    langSelect.value = newLang;
    langSelect.dispatchEvent(new Event('change'));
    window.closeSidebar();
  };
}