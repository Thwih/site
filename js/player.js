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
    if (this.s