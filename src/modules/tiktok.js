import { showToast } from './toast';
import { API_GATEWAY } from '../config/api';

export function initTikTok() {
  const tikUrlInput = document.getElementById('tikUrlInput');
  const tikBatchInput = document.getElementById('tikBatchInput');
  const tikFetchBtn = document.getElementById('tikFetchBtn');
  const tikResult = document.getElementById('tikResult');
  const tikThumb = document.getElementById('tikThumb');
  const tikTitle = document.getElementById('tikTitle');
  const tikAuthor = document.getElementById('tikAuthor');
  const tikActions = document.getElementById('tikActions');
  const tikError = document.getElementById('tikError');
  const tikMp4 = document.getElementById('tikMp4');
  const tikMp3 = document.getElementById('tikMp3');
  const tikNoWatermark = document.getElementById('tikNoWatermark');
  const batchStatus = document.getElementById('tikBatchStatus');
  const batchSummary = document.getElementById('tikBatchSummary');
  const modeSingle = document.getElementById('tikModeSingle');
  const modeBatch = document.getElementById('tikModeBatch');
  const progressWrap = document.getElementById('tikProgressWrap');
  const progressFill = document.getElementById('tikProgressFill');
  const progressLabel = document.getElementById('tikProgressLabel');
  const percentLabel = document.getElementById('tikPercentLabel');

  if (!tikUrlInput || !tikFetchBtn) return;

  let currentMode = 'single';
  let progressInterval = null;
  let progressValue = 0;
  let isProgressComplete = false;

  // Helper
  function safeString(value) {
    if (value == null) return '';
    if (typeof value === 'string') return value;
    if (typeof value === 'number') return String(value);
    if (typeof value === 'boolean') return String(value);
    if (typeof value === 'object') {
      if (value.name && typeof value.name === 'string') return value.name;
      if (value.username && typeof value.username === 'string') return value.username;
      if (value.nickname && typeof value.nickname === 'string') return value.nickname;
      if (value.title && typeof value.title === 'string') return value.title;
      if (value.text && typeof value.text === 'string') return value.text;
      if (value.url && typeof value.url === 'string') return value.url;
      if (value.uniqueId && typeof value.uniqueId === 'string') return value.uniqueId;
      if (value.id && typeof value.id === 'string') return value.id;
      if (value.author && typeof value.author === 'string') return value.author;
      if (value.toString && value.toString !== Object.prototype.toString) {
        const s = value.toString();
        if (s !== '[object Object]') return s;
      }
      try {
        const str = JSON.stringify(value);
        if (str && str !== '{}' && str !== '[]') {
          if (str.length > 50) return str.substring(0, 47) + '...';
          return str;
        }
      } catch (e) { return ''; }
    }
    return String(value);
  }

  function isValidTikTokUrl(url) {
    if (!url) return false;
    url = url.trim();
    const patterns = [
      /^https?:\/\/(www\.)?tiktok\.com\/@[\w.]+\/video\/\d+/i,
      /^https?:\/\/(vm|vt)\.tiktok\.com\/[\w-]+/i,
      /^https?:\/\/(www\.)?tiktok\.com\/@[\w.]+\/v\/\d+/i,
      /^https?:\/\/(www\.)?tiktok\.com\/@[\w.]+\/photo\/\d+/i
    ];
    return patterns.some(pattern => pattern.test(url));
  }

  // Option toggle
  document.querySelectorAll('.opt-item input[type="checkbox"]').forEach(cb => {
    const label = cb.closest('.opt-item');
    const update = () => label.classList.toggle('active', cb.checked);
    update();
    cb.addEventListener('change', update);
  });

  function setMode(mode) {
    currentMode = mode;
    modeSingle.classList.toggle('active', mode === 'single');
    modeBatch.classList.toggle('active', mode === 'batch');
    if (mode === 'single') {
      tikUrlInput.style.display = '';
      tikBatchInput.style.display = 'none';
    } else {
      tikUrlInput.style.display = 'none';
      tikBatchInput.style.display = 'block';
    }
    clearResult();
    clearBatchStatus();
    hideError();
    clearProgress();
  }

  modeSingle.addEventListener('click', () => setMode('single'));
  modeBatch.addEventListener('click', () => setMode('batch'));
  setMode('single');

  function showError(msg, detail = '') {
    tikError.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${msg}` + (detail ? `<span class="err-detail">${detail}</span>` : '');
    tikError.classList.add('show');
    tikResult.classList.remove('show');
  }

  function hideError() {
    tikError.classList.remove('show');
    tikError.innerHTML = '';
  }

  function clearResult() {
    tikResult.classList.remove('show');
    tikThumb.innerHTML = '';
    tikTitle.textContent = '';
    tikAuthor.textContent = '';
    tikActions.innerHTML = '';
    hideError();
  }

  function clearBatchStatus() {
    batchStatus.innerHTML = '';
    batchStatus.classList.remove('show');
    batchSummary.classList.remove('show');
    batchSummary.textContent = '';
    const allBtn = document.querySelector('.batch-download-all');
    if (allBtn) allBtn.remove();
  }

  function startProgress(label = 'Đang tải...') {
    clearProgress();
    progressWrap.classList.add('show');
    progressValue = 0;
    isProgressComplete = false;
    progressFill.style.width = '0%';
    progressFill.classList.add('shimmer');
    progressLabel.textContent = label;
    progressLabel.style.color = '';
    percentLabel.textContent = '0%';
    if (progressInterval) clearInterval(progressInterval);
    progressInterval = setInterval(() => {
      if (isProgressComplete) {
        if (progressValue < 100) {
          progressValue += 2;
          if (progressValue > 100) progressValue = 100;
          progressFill.style.width = progressValue + '%';
          percentLabel.textContent = Math.round(progressValue) + '%';
        }
        return;
      }
      if (progressValue < 90) {
        const inc = Math.random() * 4 + 2;
        progressValue = Math.min(progressValue + inc, 90);
        progressFill.style.width = progressValue + '%';
        percentLabel.textContent = Math.round(progressValue) + '%';
      }
    }, 200);
  }

  function updateProgress(label, percent) {
    if (!progressWrap.classList.contains('show')) startProgress(label);
    progressLabel.textContent = label;
    const val = Math.min(Math.max(percent, 0), 100);
    progressValue = val;
    progressFill.style.width = val + '%';
    percentLabel.textContent = Math.round(val) + '%';
  }

  function completeProgress(label = 'Thành công!') {
    isProgressComplete = true;
    progressLabel.innerHTML = `<i class="fas fa-check-circle"></i> ${label}`;
    progressLabel.style.color = 'var(--batch-success)';
    let current = parseInt(progressFill.style.width) || progressValue;
    const target = 100;
    const step = () => {
      if (current >= target) {
        progressFill.style.width = '100%';
        percentLabel.textContent = '100%';
        progressFill.classList.remove('shimmer');
        setTimeout(() => { clearProgress(); }, 1800);
        return;
      }
      current += 2;
      if (current > target) current = target;
      progressFill.style.width = current + '%';
      percentLabel.textContent = Math.round(current) + '%';
      requestAnimationFrame(step);
    };
    step();
  }

  function clearProgress() {
    if (progressInterval) {
      clearInterval(progressInterval);
      progressInterval = null;
    }
    progressWrap.classList.remove('show');
    progressFill.style.width = '0%';
    progressFill.classList.remove('shimmer');
    progressValue = 0;
    isProgressComplete = false;
  }

  async function fetchTikTokViaWorker(url) {
    try {
      const resp = await fetch(`${API_GATEWAY}?action=tiktok&url=${encodeURIComponent(url)}`);
      if (!resp.ok) {
        let errMsg = `HTTP ${resp.status}`;
        let errDetail = '';
        try {
          const errJson = await resp.json();
          if (resp.status === 401 || (errJson.code && errJson.code === '10401')) {
            throw new Error('Dịch vụ TikTok hiện đang bảo trì. Vui lòng thử lại sau.');
          }
          errMsg = errJson.message || errMsg;
          errDetail = errJson.code ? ` (Mã: ${errJson.code})` : '';
        } catch (e) {}
        throw new Error(errMsg + errDetail);
      }
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
        source: 'Thwih API Gateway'
      };
    } catch (error) {
      if (error.message.includes('bảo trì')) {
        throw error;
      }
      throw new Error(`Không thể tải video: ${error.message}`);
    }
  }

  async function fetchWithFallback(url) {
    try {
      startProgress('Đang kết nối...');
      updateProgress('Đang tải dữ liệu...', 20);
      const result = await fetchTikTokViaWorker(url);
      updateProgress('Lấy dữ liệu thành công', 95);
      completeProgress('Thành công!');
      return result;
    } catch (err) {
      console.warn('TikTok error:', err.message);
      clearProgress();
      throw err;
    }
  }

  function renderResult(data) {
    tikThumb.innerHTML = `<video controls preload="metadata" src="${data.videoUrl}" style="width:100%;height:auto;border-radius:0.9rem;"></video>`;
    tikTitle.textContent = data.title || 'Video TikTok';
    const authorStr = safeString(data.author);
    tikAuthor.textContent = `👤 ${authorStr} ${data.source ? '· ' + data.source : ''}`;
    let actionsHtml = '';
    if (tikMp4.checked) {
      actionsHtml += `<a href="${data.videoUrl}" target="_blank" download><i class="fas fa-video"></i> <span>Tải MP4</span></a>`;
    }
    if (tikMp3.checked && data.audioUrl && typeof data.audioUrl === 'string' && data.audioUrl.length > 0) {
      actionsHtml += `<a href="${data.audioUrl}" target="_blank" download><i class="fas fa-music"></i> <span>Tải MP3</span></a>`;
    } else if (tikMp3.checked && !data.audioUrl) {
      actionsHtml += `<a href="${data.videoUrl}" target="_blank" download><i class="fas fa-music"></i> <span>Tải MP3 (video)</span></a>`;
    }
    actionsHtml += `<a href="${data.videoUrl}" target="_blank"><i class="fas fa-external-link-alt"></i> <span>Xem video</span></a>`;
    tikActions.innerHTML = actionsHtml;
    tikResult.classList.add('show');
    hideError();
  }

  async function processBatch(links) {
    clearBatchStatus();
    let successCount = 0, failCount = 0;

    function escapeHtmlLocal(str) {
      const div = document.createElement('div');
      div.textContent = str;
      return div.innerHTML;
    }

    links.forEach((link, idx) => {
      const item = document.createElement('div');
      item.className = 'batch-item';
      item.id = `batch-item-${idx}`;
      item.innerHTML = `
        <div class="b-status pending" id="b-status-${idx}"><i class="fas fa-clock"></i></div>
        <div class="b-info">
          <div class="b-url">${escapeHtmlLocal(link)}</div>
          <div class="b-title" id="b-title-${idx}">Đang chờ...</div>
        </div>
        <div class="b-actions">
          <a class="b-link" id="b-link-${idx}" href="#" target="_blank" title="Xem video"><i class="fas fa-external-link-alt"></i></a>
          <a class="b-download" id="b-download-${idx}" href="#" download title="Tải video"><i class="fas fa-download"></i> Tải</a>
        </div>
      `;
      batchStatus.appendChild(item);
    });
    batchStatus.classList.add('show');

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
        const data = await fetchTikTokViaWorker(link);
        statusEl.className = 'b-status success';
        statusEl.innerHTML = `<i class="fas fa-check-circle"></i>`;
        const title = safeString(data.title || 'Video TikTok');
        titleEl.textContent = title;
        titleEl.className = 'b-title success';
        linkEl.href = data.videoUrl;
        linkEl.classList.add('show');
        downloadEl.href = data.videoUrl;
        downloadEl.classList.add('show');
        successCount++;
      } catch (err) {
        statusEl.className = 'b-status fail';
        statusEl.innerHTML = `<i class="fas fa-exclamation-circle"></i>`;
        titleEl.textContent = '❌ ' + err.message;
        titleEl.className = 'b-title fail';
        failCount++;
      }
      const total = links.length;
      const done = successCount + failCount;
      batchSummary.textContent = ` ${successCount}/${total} thành công  •  ❌ ${failCount} thất bại  •  ${done}/${total} đã xử lý`;
      batchSummary.classList.add('show');
    }

    let finalMsg = '';
    if (failCount === 0) finalMsg = `🎉 Tất cả ${successCount} link đều tải thành công!`;
    else if (successCount === 0) finalMsg = `❌ Tất cả ${failCount} link đều thất bại. Vui lòng kiểm tra lại.`;
    else finalMsg = ` ${successCount} thành công, ❌ ${failCount} thất bại.`;
    batchSummary.textContent = finalMsg;
    batchSummary.classList.add('show');
    const existingBtn = document.querySelector('.batch-download-all');
    if (existingBtn) existingBtn.remove();
    if (successCount > 0) {
      const btnAll = document.createElement('button');
      btnAll.className = 'batch-download-all';
      btnAll.innerHTML = `<i class="fas fa-download"></i> Tải tất cả (${successCount} video)`;
      btnAll.addEventListener('click', function() {
        const downloadLinks = document.querySelectorAll('.b-download.show');
        if (downloadLinks.length === 0) { alert('Không có video nào để tải!'); return; }
        downloadLinks.forEach(el => {
          window.open(el.href, '_blank');
        });
      });
      batchSummary.appendChild(btnAll);
    }
    clearProgress();
  }

  tikFetchBtn.addEventListener('click', async function() {
    clearResult();
    hideError();
    clearProgress();
    clearBatchStatus();

    if (currentMode === 'single') {
      const url = tikUrlInput.value.trim();
      if (!url) { showError('Vui lòng nhập link TikTok'); return; }
      if (!isValidTikTokUrl(url)) {
        showError('Link không hợp lệ');
        return;
      }
      tikFetchBtn.disabled = true;
      tikFetchBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang xử lý...';
      try {
        const data = await fetchWithFallback(url);
        renderResult(data);
      } catch (error) {
        console.error('TikTok error:', error.message);
        showError('❌ ' + error.message);
        tikResult.classList.remove('show');
        clearProgress();
      } finally {
        tikFetchBtn.disabled = false;
        tikFetchBtn.innerHTML = '<i class="fas fa-cloud-download-alt"></i> Tải xuống';
      }
    } else {
      const text = tikBatchInput.value.trim();
      if (!text) { showError('Vui lòng nhập ít nhất 1 link TikTok'); return; }
      const links = text.split('\n').map(s => s.trim()).filter(s => s.length > 0);
      const invalidLinks = links.filter(l => !isValidTikTokUrl(l));
      if (invalidLinks.length > 0) {
        showError(`Có ${invalidLinks.length} link không hợp lệ. Vui lòng kiểm tra lại.`);
        return;
      }
      tikFetchBtn.disabled = true;
      tikFetchBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang tải batch...';
      try {
        await processBatch(links);
      } catch (error) {
        console.error('Batch error:', error.message);
        showError('❌ ' + error.message);
      } finally {
        tikFetchBtn.disabled = false;
        tikFetchBtn.innerHTML = '<i class="fas fa-cloud-download-alt"></i> Tải xuống';
      }
    }
  });

  tikUrlInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') { e.preventDefault(); tikFetchBtn.click(); }
  });
  tikBatchInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); tikFetchBtn.click(); }
  });
  tikUrlInput.addEventListener('focus', function() { clearResult(); hideError(); });
  tikUrlInput.addEventListener('input', function() { hideError(); });

  const endpointDisplay = document.getElementById('apiEndpointDisplay');
  if (endpointDisplay) { endpointDisplay.textContent = 'Thwih Gateway'; }
}