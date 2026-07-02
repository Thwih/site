export function initSidebar() {
    const menuBtn = document.getElementById('menuBtn');
    const sidebar = document.getElementById('sidebar');
    const menuOverlay2 = document.getElementById('menuOverlay');
    const sidebarClose = document.getElementById('sidebarClose');
    function openSidebar() {
        if (sidebar && menuOverlay2) {
            sidebar.classList.add('active');
            menuOverlay2.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }
    window.closeSidebar = function() {
        if (sidebar && menuOverlay2) {
            sidebar.classList.remove('active');
            menuOverlay2.classList.remove('active');
            document.body.style.overflow = '';
        }
    };
    if (menuBtn) menuBtn.addEventListener('click', openSidebar);
    if (sidebarClose) sidebarClose.addEventListener('click', window.closeSidebar);
    if (menuOverlay2) menuOverlay2.addEventListener('click', window.closeSidebar);

    // Theme toggle trong sidebar
    const sidebarThemeToggle = document.getElementById('sidebarThemeToggle');
    if (sidebarThemeToggle) {
        sidebarThemeToggle.addEventListener('click', function() {
            const html = document.documentElement;
            const newTheme = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            html.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            const icon = document.getElementById('themeIcon');
            if (icon) icon.className = newTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
            window.closeSidebar();
        });
    }

    // Language toggle
    window.toggleSidebarLanguage = function() {
        const currentLang = localStorage.getItem('lang') || 'vi';
        const newLang = currentLang === 'vi' ? 'en' : 'vi';
        const langSelect = document.getElementById('langSelect');
        if (langSelect) langSelect.value = newLang;
        // applyLanguage will be called from app.js, but we need to trigger it
        const event = new Event('change', { bubbles: true });
        if (langSelect) langSelect.dispatchEvent(event);
        window.closeSidebar();
    };
}