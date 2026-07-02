// ===== Các phương thức còn thiếu trong class MusicPlayer =====

addToPlaylist(name, artist, src, img) {
  const isDuplicate = this.playlist.some(song =>
    song.src === src || (song.name.toLowerCase() === name.toLowerCase() && song.artist.toLowerCase() === artist.toLowerCase())
  );
  if (isDuplicate) {
    showToast('Bài hát đã có trong danh sách!', 'error');
    return false;
  }
  this.playlist.push({ name, artist, src, img: img || '' });
  this.renderPlaylist();
  this.updatePlaylistCount();
  if (this.playlist.length === 1) { this.currentIndex = 0; this.loadSong(0); }
  return true;
}

removeFromPlaylist(index) {
  if (this.playlist.length === 0) return;
  const song = this.playlist[index];
  if (song.src && song.src.startsWith('blob:')) { URL.revokeObjectURL(song.src); }
  this.playlist.splice(index, 1);
  if (this.currentIndex === index) {
    if (this.playlist.length > 0) {
      this.currentIndex = Math.min(index, this.playlist.length - 1);
      this.loadSong(this.currentIndex, true);
      if (this.isPlaying && this.audio) this.audio.play();
    } else {
      this.currentIndex = -1;
      this.audio.src = ''; this.audio.load();
      this.isPlaying = false;
      this.playIcon.className = 'fas fa-play';
      const t = getTranslation;
      this.songName.textContent = t('player_no_song');
      this.artistName.textContent = t('player_user');
      this.cover.innerHTML = '<i class="fas fa-music"></i>';
      this.updateDisplay();
    }
  } else if (this.currentIndex > index) { this.currentIndex--; }
  this.renderPlaylist();
  this.updatePlaylistCount();
  this.updatePlaylistActive();
}

togglePlaylist() {
  this.playlistContainer.classList.toggle('open');
  const icon = this.playlistToggle.querySelector('i');
  if (icon) icon.className = this.playlistContainer.classList.contains('open') ? 'fas fa-chevron-up' : 'fas fa-list';
}

updatePlaylistCount() { if (this.playlistCount) this.playlistCount.textContent = this.playlist.length; }

updatePlaylistActive() {
  const items = this.playlistContainer.querySelectorAll('.playlist-item');
  items.forEach((item, idx) => item.classList.toggle('active', idx === this.currentIndex));
}

setupEventListeners() {
  this.playBtn.addEventListener('click', () => this.togglePlay());
  this.progressBar.addEventListener('click', (e) => this.seek(e));
  this.prevBtn.addEventListener('click', () => this.prev());
  this.nextBtn.addEventListener('click', () => this.next());
  this.playlistToggle.addEventListener('click', () => this.togglePlaylist());
  // Thêm các sự kiện khác nếu cần
}