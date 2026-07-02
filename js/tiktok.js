import { API_GATEWAY, showToast } from './utils.js';

export class TikTokDownloader {
  constructor() {
    this.mode = 'single';
    this._bindUI();
  }

  _bindUI() {
    this.urlInput = document.getElementById('tikUrlInput');
    this.batchInput = document.getElementById('tikBatchInput');
    this.fetchBtn = document.getElementById('tikFetchBtn');
    this.resultDiv = document.getElementById('tikResult');
    this.thumbDiv = document.getElementById('tikThumb');
    this.titleDiv = document.getElementById('tikTitle');
    this.authorDiv = document.getElementById('tikAuthor');
    this.actionsDiv = document.getElementById('tikActions');
    this.errorDiv = document.getElementById('tikError');
    this.mp4Check = document.getElementById('tikMp4');
    this.mp3Check = document.getElementById('tikMp3');
    this.noWatermark = document.getElementById('tikNoWatermark');
    this.batchStatus = document.getElementById('tikBatchStatus');
    this.batchSummary = document.getElementById('tikBatchSummary');
    this.modeSingle = document.getElementById('tikModeSingle');
    this.modeBatch = document.getElementById('tikModeBatch');
    this.progressWrap = document.getElementById('tikProgressWrap');
    this.progressFill = document.getElementById('tikProgressFill');
    this.progressLabel = document.getElementById('tikProgressLabel');
    this.percentLabel = document.getElementById('tikPercentLabel');

    document.querySelectorAll('.opt-item input[type="checkbox"]').forEach(cb => {
      const label = cb.closest('.opt-item');
      const update = () => label.classList.toggle('active', cb.checked);
      update();
      cb.addEventListener('change', update);
    });

    this.modeSingle.addEventListener('click', () => this.setMode('single'));
    this.modeBatch.addEventListener('click', () => this.setMode('batch'));
    this.fetchBtn.addEventListener('click', () => this.handleFetch());
    this.urlInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') this.handleFetch(); });
    this.batchInput.addEventListener('keydown', (e) => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) this.handleFetch(); });
    this.setMode('single');
  }

  setMode(mode) {
    this.mode = mode;
    this.modeSingle.classList.toggle('active', mode === 'single');
    this.modeBatch.classList.toggle('active', mode === 'batch');
    if (mode === 'single') {
      this.urlInput.style.display = '';
      this.batchInput.style.display = 'none';
    } else {
      this.urlInput.style.display = 'none';
      this.batchInput.style.display = 'block';
    }
    this.clearResult();
    this.clearBatchStatus();
    this.hideError();
    this.clearProgress();
  }

  isValidUrl(url) {
    if (!url) return false;
    url = url.trim();
    const patterns = [
      /^https?:\/\/(www\.)?tiktok\.com\/@[\w.]+\/video\/\d+/i,
      /^https?:\/\/(vm|vt)\.tiktok\.com\/[\w-]+/i,
      /^https?:\/\/(www\.)?tiktok\.com\/@[\w.]+\/v\/\d+/i,
      /^https?:\/\/(www\.)?tiktok\.com\/@[\w.]+\/photo\/\d+/i
    ];
    return patterns.some(p => p.test(url));
  }

  showError(msg) {
    this.errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${msg}`;
    this.errorDiv.classList.add('show');
    this.resultDiv.classList.remove('show');
  }

  hideError() { this.errorDiv.classList.remove('show'); this.errorDiv.innerHTML = ''; }

  clearResult() {
    this.resultDiv.classList.remove('show');
    this.thumbDiv.innerHTML = '';
    this.titleDiv.textContent = '';
    this.authorDiv.textContent = '';
    this.actionsDiv.innerHTML = '';
    this.hideError();
  }

  clearBatchStatus() {
    this.batchStatus.innerHTML = '';
    this.batchStatus.classList.remove('show');
    this.batchSummary.classList.remove('show');
    this.batchSummary.textContent = '';
    const allBtn = document.querySelector('.batch-download-all');
    if (allBtn) allBtn.remove();
  }

  clearProgress() {
    this.progressWrap.classList.remove('show');
    this.progressFill.style.width = '0%';
    this.progressFill.classList.remove('shimmer');
    this.progressLabel.textContent = 'Đang tải...';
    this.percentLabel.textContent = '0%';
    if (this._progressInterval) clearInterval(this._progressInterval);
    this._progressValue = 0;
    this._isComplete = false;
  }

  startProgress(label = 'Đang tải...') {
    this.clearProgress();
    this.progressWrap.classList.add('show');
    this._progressValue = 0;
    this._isComplete = false;
    this.progressFill.style.width = '0%';
    this.progressFill.classList.add('shimmer');
    this.progressLabel.textContent = label;
    this.percentLabel.textContent = '0%';
    this._progressInterval = setInterval(() => {
      if (this._isComplete) {
        if (this._progressValue < 100) {
          this._progressValue += 2;
          if (this._progressValue > 100) this._progressValue = 100;
          this.progressFill.style.width = this._progressValue + '%';
          this.percentLabel.textContent = Math.round(this._progressValue) + '%';
        }
        return;
      }
      if (this._progressValue < 90) {
        const inc = Math.random() * 4 + 2;
        this._progressValue = Math.min(this._progressValue + inc, 90);
        this.progressFill.style.width = this._progressValue + '%';
        this.percentLabel.textContent = Math.round(this._progressValue) + '%';
      }
    }, 200);
  }

  completeProgress(label = 'Thành công!') {
    this._isComplete = true;
    this.progressLabel.innerHTML = `<i class="fas fa-check-circle"></i> ${label}`;
    this.progressLabel.style.color = 'var(--batch-success)';
    let current = parseInt(this.progressFill.style.width) || this._progressValue;
    const step = () => {
      if (current >= 100) {
        this.progressFill.style.width = '100%';
        this.percentLabel.textContent = '100%';
        this.progressFill.classList.remove('shimmer');
        setTimeout(() => this.clearProgress(), 1800);
        return;
      }
      current += 2;
      if (current > 100) current = 100;
      this.progressFill.style.width = current + '%';
      this.percentLabel.textContent = Math.round(current) + '%';
      requestAnimationFrame(step);
    };
    step();
  }

  async _fetchViaWorker(url) {
    const resp = await fetch(`${API_GATEWAY}?action=tiktok&url=${encodeURIComponent(url)}`);
    if (!resp.ok) { const err = await resp.json(); throw new Error(err.error || `HTTP ${resp.status}`); }
    const json = await resp.json();
    if (!json.success) throw new Error(json.error || 'TikTok API error');
    const data = json.data;
    if (!data.videoUrl) throw new Error('Missing videoUrl');
    return {
      videoUrl: data.videoUrl,
      audioUrl: data.audioUrl || null,
      thumb: data.cover || '',
      title: data.title || 'Video TikTok',
      author: data.author || 'Unknown',
      source: 'Thwih Gateway'
    };
  }

  async handleFetch() {
    this.clearResult();
    this.hideError();
    this.clearProgress();
    this.clearBatchStatus();

    if (this.mode === 'single') {
      const url = this.urlInput.value.trim();
      if (!url) { this.showError('Vui lòng nhập link TikTok'); return; }
      if (!this.isValidUrl(url)) { this.showError('Link không hợp lệ'); return; }
      this.fetchBtn.disabled = true;
      this.fetchBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang xử lý...';
      try {
        this.startProgress('Đang kết nối...');
        const data = await this._fetchViaWorker(url);
        this.completeProgress('Thành công!');
        this.renderResult(data);
      } catch (error) {
        console.error(error);
        this.showError('❌ ' + error.message);
        this.clearProgress();
      } finally {
        this.fetchBtn.disabled = false;
        this.fetchBtn.innerHTML = '<i class="fas fa-cloud-download-alt"></i> Tải xuống';
      }
    } else {
      const text = this.batchInput.value.trim();
      if (!text) { this.showError('Vui lòng nhập ít nhất 1 link TikTok'); return; }
      const links = text.split('\n').map(s => s.trim()).filter(s => s.length > 0);
      const invalid = links.filter(l => !this.isValidUrl(l));
      if (invalid.length > 0) { this.showError(`Có ${invalid.length} link không hợp lệ.`); return; }
      this.fetchBtn.disabled = true;
      this.fetchBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang tải batch...';
      try {
        await this.processBatch(links);
      } catch (error) {
        console.error(error);
        this.showError('❌ ' + error.message);
      } finally {
        this.fetchBtn.disabled = false;
        this.fetchBtn.innerHTML = '<i class="fas fa-cloud-download-alt"></i> Tải xuống';
      }
    }
  }

  renderResult(data) {
    this.thumbDiv.innerHTML = `<video controls preload="metadata" src="${data.videoUrl}" style="width:100%;height:auto;border-radius:0.9rem;"></video>`;
    this.titleDiv.textContent = data.title || 'Video TikTok';
    this.authorDiv.textContent = `👤 ${data.author} ${data.source ? '· ' + data.source : ''}`;
    let html = '';
    if (this.mp4Check.checked) {
      html += `<a href="${data.videoUrl}" target="_blank" download><i class="fas fa-video"></i> <span>Tải MP4</span></a>`;
    }
    if (this.mp3Check.checked && data.audioUrl && data.audioUrl.length > 0) {
      html += `<a href="${data.audioUrl}" target="_blank" download><i class="fas fa-music"></i> <span>Tải MP3</span></a>`;
    } else if (this.mp3Check.checked && !data.audioUrl) {
      html += `<a href="${data.videoUrl}" target="_blank" download><i class="fas fa-music"></i> <span>Tải MP3 (video)</span></a>`;
    }
    html += `<a href="${data.videoUrl}" target="_blank"><i class="fas fa-external-link-alt"></i> <span>Xem video</span></a>`;
    this.actionsDiv.innerHTML = html;
    this.resultDiv.classList.add('show');
    this.hideError();
  }

  async processBatch(links) {
    this.clearBatchStatus();
    let success = 0, fail = 0;
    const escape = (str) => { const d = document.createElement('div'); d.textContent = str; return d.innerHTML; };
    links.forEach((link, i) => {
      const item = document.createElement('div');
      item.className = 'batch-item';
      item.id = `batch-item-${i}`;
      item.innerHTML = `
        <div class="b-status pending" id="b-status-${i}"><i class="fas fa-clock"></i></div>
        <div class="b-info">
          <div class="b-url">${escape(link)}</div>
          <div class="b-title" id="b-title-${i}">Đang chờ...</div>
        </div>
        <div class="b-actions">
          <a class="b-link" id="b-link-${i}" href="#" target="_blank" title="Xem video"><i class="fas fa-external-link-alt"></i></a>
          <a class="b-download" id="b-download-${i}" href="#" download title="Tải video"><i class="fas fa-download"></i> Tải</a>
        </div>
      `;
      this.batchStatus.appendChild(item);
    });
    this.batchStatus.classList.add('show');

    for (let i = 0; i < links.length; i++) {
      const link = links[i].trim();
      const statusEl = document.getElementById(`b-status-${i}`);
      const titleEl = document.getElementById(`b-title-${i}`);
      const linkEl = document.getElementById(`b-link-${i}`);
      const downloadEl = document.getElementById(`b-download-${i}`);
      statusEl.className = 'b-status loading';
      statusEl.innerHTML = '<i class="fas fa-spinner fa-pulse"></i>';
      titleEl.textContent = 'Đang tải...';
      try {
        const data = await this._fetchViaWorker(link);
        statusEl.className = 'b-status success';
        statusEl.innerHTML = `<i class="fas fa-check-circle"></i>`;
        const title = data.title || 'Video TikTok';
        titleEl.textContent = title;
        titleEl.className = 'b-title success';
        linkEl.href = data.videoUrl;
        linkEl.classList.add('show');
        downloadEl.href = data.videoUrl;
        downloadEl.classList.add('show');
        success++;
      } catch (err) {
        statusEl.className = 'b-status fail';
        statusEl.innerHTML = `<i class="fas fa-exclamation-circle"></i>`;
        titleEl.textContent = '❌ ' + err.message;
        titleEl.className = 'b-title fail';
        fail++;
      }
      const total = links.length;
      this.batchSummary.textContent = ` ${success}/${total} thành công  •  ❌ ${fail} thất bại  •  ${success+fail}/${total} đã xử lý`;
      this.batchSummary.classList.add('show');
    }

    let final = '';
    if (fail === 0) final = `🎉 Tất cả ${success} link đều tải thành công!`;
    else if (success === 0) final = `❌ Tất cả ${fail} link đều thất bại.`;
    else final = ` ${success} thành công, ❌ ${fail} thất bại.`;
    this.batchSummary.textContent = final;
    this.batchSummary.classList.add('show');
    const existing = document.querySelector('.batch-download-all');
    if (existing) existing.remove();
    if (success > 0) {
      const btn = document.createElement('button');
      btn.className = 'batch-download-all';
      btn.innerHTML = `<i class="fas fa-download"></i> Tải tất cả (${success} video)`;
      btn.addEventListener('click', () => {
        const downloads = document.querySelectorAll('.b-download.show');
        if (downloads.length === 0) { alert('Không có video nào!'); return; }
        downloads.forEach(el => window.open(el.href, '_blank'));
      });
      this.batchSummary.appendChild(btn);
    }
    this.clearProgress();
  }
}