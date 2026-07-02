import { showToast } from './utils.js';

export class MusicPlayer {
  constructor() {
    this.audio = new Audio();
    this.playlist = [];
    this.currentIndex = -1;
    this.isPlaying = false;
    this.progressInterval = null;
    this.isTransitioning = false;
    this.totalTime = 0;
    this.currentTime = 0;

    // DOM refs
    this.cover = document.getElementById('playerCover');
    this.songName = document.getElementById('playerSongName');
    this.artistName = document.getElementById('playerArtistName');
    this.playBtn = document.getElementById('playBtn');
    this.playIcon = document.getElementById('playIcon');
    this.progressFill = document.getElementById('playerProgressFill');
    this.progressDot = document.getElementById('progressDot');
    this.progressBar = document.getElementById('progressBar');
    this.currentTimeEl = document.getElementById('currentTime');
    this.totalTimeEl = document.getElementById('totalTime');
    this.playlistContainer = document.getElementById('playlistContainer');
    this.playlistToggle = document.getElementById('playlistToggle');
    this.playlistCount = document.getElementById('playlistCount');
    this.prevBtn = document.getElementById('prevBtn');
    this.nextBtn = document.getElementById('nextBtn');

    this._bindEvents();
    this.renderPlaylist();
    this.updatePlaylistCount();
    this._resetUI();
  }

  _resetUI() {
    const t = window.__i18n || { player_no_song: 'Chưa có nhạc', player_user: 'Người dùng' };
    if (this.songName) this.songName.textContent = t.player_no_song;
    if (this.artistName) this.artistName.textContent = t.player_user;
    if (this.cover) this.cover.innerHTML = '<i class="fas fa-music"></i>';
    this.updateDisplay();
  }

  updateI18n(t) {
    if (this.playlist.length === 0) {
      if (this.songName) this.songName.textContent = t.player_no_song;
      if (this.artistName) this.artistName.textContent = t.player_user;
    }
  }

  _bindEvents() {
    this.audio.addEventListener('loadedmetadata', () => {
      this.totalTime = this.audio.duration;
      this.updateDisplay();
      if (this.audio.src && this.currentIndex >= 0) {
        this.isPlaying = true;
        if (this.playIcon) this.playIcon.className = 'fas fa-pause';
        this.audio.play().catch(() => {});
        this.startProgress();
        this.updatePlaylistActive();
      }
    });
    this.audio.addEventListener('timeupdate', () => {
      this.currentTime = this.audio.currentTime;
      this.updateDisplay();
      this.updateProgress();
    });
    this.audio.addEventListener('ended', () => this.next());
    this.audio.addEventListener('error', (e) => console.error('Audio error:', e));

    if (this.playBtn) this.playBtn.addEventListener('click', () => this.togglePlay());
    if (this.progressBar) this.progressBar.addEventListener('click', (e) => this.seek(e));
    if (this.prevBtn) this.prevBtn.addEventListener('click', () => this.prev());
    if (this.nextBtn) this.nextBtn.addEventListener('click', () => this.next());
    if (this.playlistToggle) this.playlistToggle.addEventListener('click', () => this.togglePlaylist());
  }

  addToPlaylist(name, artist, src, img) {
    const isDuplicate = this.playlist.some(s => s.src === src || (s.name === name && s.artist === artist));
    if (isDuplicate) { showToast(`Bài hát "${name}" đã có trong danh sách.`, 'info', 3000); return false; }
    this.playlist.push({ name, artist, src, img: img || '' });
    this.renderPlaylist();
    this.updatePlaylistCount();
    if (this.playlist.length === 1) { this.currentIndex = 0; this.loadSong(0); }
    return true;
  }

  loadSong(index, animate = true) {
    if (index < 0 || index >= this.playlist.length) return;
    const load = () => {
      this.currentIndex = index;
      const song = this.playlist[index];
      if (this.songName) this.songName.textContent = song.name || 'Không tên';
      if (this.artistName) this.artistName.textContent = song.artist || 'Người dùng';
      if (this.cover) {
        if (song.img) { this.cover.innerHTML = `<img src="${song.img}" alt="cover">`; }
        else { this.cover.innerHTML = '<i class="fas fa-music"></i>'; }
      }
      if (this.audio) {
        if (song.src) {
          this.audio.src = song.src;
          this.audio.load();
          if (this.isPlaying) { this.audio.play().catch(() => {}); }
        } else {
          this.audio.src = '';
          this.audio.load();
          this.isPlaying = false;
          if (this.playIcon) this.playIcon.className = 'fas fa-play';
        }
      }
      this.updateDisplay();
      this.renderPlaylist();
      this.updatePlaylistActive();
    };
    if (animate && this.currentIndex >= 0) { this.animateTransition(load); } else { load(); }
  }

  animateTransition(callback) {
    if (this.isTransitioning) return;
    this.isTransitioning = true;
    if (this.cover) this.cover.classList.add('fade-out');
    if (this.songName) this.songName.classList.add('fade-out');
    if (this.artistName) this.artistName.classList.add('fade-out');
    setTimeout(() => {
      if (callback) callback();
      if (this.cover) { this.cover.classList.remove('fade-out'); this.cover.classList.add('fade-in'); }
      if (this.songName) { this.songName.classList.remove('fade-out'); this.songName.classList.add('fade-in'); }
      if (this.artistName) { this.artistName.classList.remove('fade-out'); this.artistName.classList.add('fade-in'); }
      setTimeout(() => {
        if (this.cover) this.cover.classList.remove('fade-in');
        if (this.songName) this.songName.classList.remove('fade-in');
        if (this.artistName) this.artistName.classList.remove('fade-in');
        this.isTransitioning = false;
      }, 400);
    }, 280);
  }

  togglePlay() {
    if (this.currentIndex < 0 || this.playlist.length === 0) { showToast('Danh sách phát trống.', 'info', 3000); return; }
    const song = this.playlist[this.currentIndex];
    if (!song.src) { showToast('Bài hát chưa có file nhạc.', 'error', 3000); return; }
    this.isPlaying = !this.isPlaying;
    if (this.isPlaying) {
      if (this.playIcon) this.playIcon.className = 'fas fa-pause';
      if (this.audio) { this.audio.play().catch(() => {}); }
      this.startProgress();
    } else {
      if (this.playIcon) this.playIcon.className = 'fas fa-play';
      if (this.audio) this.audio.pause();
      this.stopProgress();
    }
    this.updatePlaylistActive();
  }

  startProgress() {
    this.stopProgress();
    this.progressInterval = setInterval(() => {
      if (!this.isPlaying || !this.audio) return;
      this.currentTime = this.audio.currentTime;
      this.updateDisplay();
      this.updateProgress();
    }, 200);
  }

  stopProgress() {
    if (this.progressInterval) { clearInterval(this.progressInterval); this.progressInterval = null; }
  }

  updateDisplay() {
    const current = this.formatTime(this.currentTime);
    const total = this.formatTime(this.totalTime);
    if (this.currentTimeEl) this.currentTimeEl.textContent = current;
    if (this.totalTimeEl) this.totalTimeEl.textContent = '-' + (this.totalTime ? total : '0:00');
  }

  updateProgress() {
    const percent = this.totalTime ? (this.currentTime / this.totalTime) * 100 : 0;
    if (this.progressFill) this.progressFill.style.width = percent + '%';
    if (this.progressDot) this.progressDot.style.left = percent + '%';
  }

  formatTime(seconds) {
    if (isNaN(seconds) || !isFinite(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return mins + ':' + String(secs).padStart(2, '0');
  }

  seek(e) {
    if (!this.audio || !this.audio.src) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = Math.max(0, Math.min(1, x / rect.width));
    this.audio.currentTime = percent * this.totalTime;
    this.currentTime = this.audio.currentTime;
    this.updateDisplay();
    this.updateProgress();
  }

  prev() {
    if (this.playlist.length === 0) return;
    this.currentIndex = (this.currentIndex - 1 + this.playlist.length) % this.playlist.length;
    this.loadSong(this.currentIndex, true);
    if (this.isPlaying && this.audio) { this.audio.play().catch(() => {}); }
  }

  next() {
    if (this.playlist.length === 0) return;
    this.currentIndex = (this.currentIndex + 1) % this.playlist.length;
    this.loadSong(this.currentIndex, true);
    if (this.isPlaying && this.audio) { this.audio.play().catch(() => {}); }
  }

  renderPlaylist() {
    if (!this.playlistContainer) return;
    this.playlistContainer.innerHTML = '';
    this.playlist.forEach((song, index) => {
      const item = document.createElement('div');
      item.className = 'playlist-item' + (index === this.currentIndex ? ' active' : '');
      item.innerHTML = `
        <div class="pl-cover">${song.img ? `<img src="${song.img}" style="width:100%;height:100%;object-fit:cover;">` : '<i class="fas fa-music"></i>'}</div>
        <div class="pl-info"><div class="pl-name">${song.name || 'Không tên'}</div><div class="pl-artist">${song.artist || 'Người dùng'}</div></div>
        <button class="pl-remove" data-index="${index}"><i class="fas fa-times"></i></button>
      `;
      item.addEventListener('click', (e) => {
        if (e.target.closest('.pl-remove')) return;
        this.currentIndex = index;
        this.loadSong(index, true);
        if (!this.isPlaying) {
          this.isPlaying = true;
          if (this.playIcon) this.playIcon.className = 'fas fa-pause';
          if (this.audio) { this.audio.play().catch(() => {}); }
          this.startProgress();
        }
        this.renderPlaylist();
      });
      const removeBtn = item.querySelector('.pl-remove');
      if (removeBtn) {
        removeBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.removeFromPlaylist(index);
        });
      }
      this.playlistContainer.appendChild(item);
    });
    this.updatePlaylistCount();
  }

  removeFromPlaylist(index) {
    if (this.playlist.length === 0) return;
    const song = this.playlist[index];
    if (song.src && song.src.startsWith('blob:')) { try { URL.revokeObjectURL(song.src); } catch (e) {} }
    this.playlist.splice(index, 1);
    if (this.currentIndex === index) {
      if (this.playlist.length > 0) {
        this.currentIndex = Math.min(index, this.playlist.length - 1);
        this.loadSong(this.currentIndex, true);
        if (this.isPlaying && this.audio) { this.audio.play().catch(() => {}); }
      } else {
        this.currentIndex = -1;
        if (this.audio) { this.audio.src = ''; this.audio.load(); }
        this.isPlaying = false;
        if (this.playIcon) this.playIcon.className = 'fas fa-play';
        const t = window.__i18n || { player_no_song: 'Chưa có nhạc', player_user: 'Người dùng' };
        if (this.songName) this.songName.textContent = t.player_no_song;
        if (this.artistName) this.artistName.textContent = t.player_user;
        if (this.cover) this.cover.innerHTML = '<i class="fas fa-music"></i>';
        this.updateDisplay();
      }
    } else if (this.currentIndex > index) { this.currentIndex--; }
    this.renderPlaylist();
    this.updatePlaylistCount();
    this.updatePlaylistActive();
  }

  togglePlaylist() {
    if (!this.playlistContainer || !this.playlistToggle) return;
    this.playlistContainer.classList.toggle('open');
    const icon = this.playlistToggle.querySelector('i');
    if (icon) {
      icon.className = this.playlistContainer.classList.contains('open') ? 'fas fa-chevron-up' : 'fas fa-list';
    }
  }

  updatePlaylistCount() {
    if (this.playlistCount) this.playlistCount.textContent = this.playlist.length;
  }

  updatePlaylistActive() {
    if (!this.playlistContainer) return;
    const items = this.playlistContainer.querySelectorAll('.playlist-item');
    items.forEach((item, idx) => { item.classList.toggle('active', idx === this.currentIndex); });
  }
}