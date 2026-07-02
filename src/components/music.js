export function renderMusic() {
  return `
    <div class="music-section" id="musicSection">
      <div class="section-title" data-i18n="music_title"><i class="fas fa-music"></i> Lấy Nhạc</div>
      <div class="music-grid">
        <a href="https://docs.google.com/document/d/1-2uiAgYJKKeKJ3djo3oR80bp0HpJYesvgqT4yS-c85o/edit?usp=drivesdk" target="_blank" class="music-card">
          <div class="left"><span class="icon-box"><i class="fas fa-music"></i></span><span class="info"><span class="name" data-i18n="free_music">Get Music 2026</span><span class="desc"><i class="fas fa-calendar-alt"></i> <span data-i18n="music_updated">Cập nhật liên tục</span> <i class="fas fa-download" style="margin-left:8px;"></i> <span data-i18n="music_free">Tải miễn phí</span></span></span></div>
          <div class="right"><span class="badge">Google Docs</span><span class="arrow"><i class="fas fa-chevron-right"></i></span></div>
        </a>
        <a href="https://docs.google.com/document/d/1-2uiAgYJKKeKJ3djo3oR80bp0HpJYesvgqT4yS-c85o/edit?usp=drivesdk" target="_blank" class="music-card">
          <div class="left"><span class="icon-box"><i class="fas fa-headphones"></i></span><span class="info"><span class="name" data-i18n="library">Thư viện nhạc</span><span class="desc"><i class="fas fa-list-ul"></i> <span data-i18n="library_diverse">Đa dạng thể loại</span> <i class="fas fa-infinity" style="margin-left:8px;"></i> <span data-i18n="library_unlimited">Không giới hạn</span></span></span></div>
          <div class="right"><span class="badge" data-i18n="badge_list">Danh sách</span><span class="arrow"><i class="fas fa-chevron-right"></i></span></div>
        </a>
      </div>

      <!-- Search -->
      <div class="music-search-section" id="searchSection">
        <div class="section-title" style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;">
          <i class="fas fa-search"></i>
          <span data-i18n="search_title">Tìm kiếm &amp; chọn nhạc</span>
          <button id="refreshSongsBtn" style="margin-left:auto;background:var(--glass-bg);border:1px solid var(--glass-border);border-radius:40px;padding:0.3rem 1rem;color:var(--text-muted);cursor:pointer;transition:all 0.3s;font-size:0.8rem;display:flex;align-items:center;gap:6px;">
            <i class="fas fa-sync-alt"></i> <span data-i18n="refresh_btn">Làm mới</span>
          </button>
        </div>
        <div class="search-box">
          <i class="fas fa-search"></i>
          <input type="text" id="searchInput" data-i18n-placeholder="search_placeholder" placeholder="Nhập tên bài hát..." />
          <button class="clear-btn" id="clearSearch"><i class="fas fa-times"></i></button>
        </div>
        <div class="song-count" id="songCountDisplay">Đang tải...</div>
        <div class="link-speed-note">
          <i class="fas fa-clock"></i>
          <span><strong>Thwih Thông Báo:</strong> Tạo Link có thể mất vài Giây!</span>
        </div>
        <div class="song-list" id="songList"></div>
      </div>
    </div>
  `;
}