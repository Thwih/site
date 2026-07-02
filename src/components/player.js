export function renderPlayer() {
  return `
    <div class="player-wrapper" id="playerWrapper">
      <div class="player-top">
        <div class="player-cover" id="playerCover"><i class="fas fa-music"></i></div>
        <div class="player-info">
          <div class="song-name" id="playerSongName" data-i18n="player_no_song">Chưa có nhạc</div>
          <div class="artist-name" id="playerArtistName" data-i18n="player_user">Người dùng</div>
        </div>
        <div class="player-controls">
          <button id="prevBtn"><i class="fas fa-step-backward"></i></button>
          <button class="play-btn" id="playBtn"><i class="fas fa-play" id="playIcon"></i></button>
          <button id="nextBtn"><i class="fas fa-step-forward"></i></button>
        </div>
      </div>
      <div class="player-progress-area">
        <span class="time" id="currentTime">0:00</span>
        <div class="progress-bar" id="progressBar">
          <div class="progress-fill" id="playerProgressFill"></div>
          <div class="progress-dot" id="progressDot"></div>
        </div>
        <span class="time" id="totalTime">-0:00</span>
      </div>
      <div class="player-bottom">
        <button class="playlist-toggle" id="playlistToggle"><i class="fas fa-list"></i> <span data-i18n="playlist_label">Danh sách</span> <span class="badge" id="playlistCount">0</span></button>
      </div>
      <div class="playlist-container" id="playlistContainer"></div>
    </div>
  `;
}