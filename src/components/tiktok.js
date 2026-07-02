export function renderTikTok() {
  return `
    <div class="tik-section" id="tikSection">
      <div class="section-title"><i class="fas fa-download"></i> <span data-i18n="tiktok_title">Tải Video MP3, MP4</span></div>
      <div class="tik-downloader-box">
        <div class="tik-mode-toggle">
          <button class="active" data-mode="single" id="tikModeSingle"><i class="fas fa-link"></i> <span data-i18n="tiktok_single">1 Link</span></button>
          <button data-mode="batch" id="tikModeBatch"><i class="fas fa-layer-group"></i> <span data-i18n="tiktok_batch">Nhiều link</span></button>
        </div>
        <div class="tik-input-group">
          <input type="text" id="tikUrlInput" data-i18n-placeholder="tiktok_input_placeholder" placeholder="Dán link TikTok..." />
          <textarea id="tikBatchInput" data-i18n-placeholder="tiktok_batch_placeholder" placeholder="Mỗi link 1 dòng..."></textarea>
          <button class="tik-btn-download" id="tikFetchBtn"><i class="fas fa-cloud-download-alt"></i> <span data-i18n="tiktok_download_btn">Tải xuống</span></button>
        </div>
        <div class="tik-options-compact">
          <label class="opt-item"><input type="checkbox" id="tikMp4" checked><i class="fas fa-video"></i> <span data-i18n="tiktok_mp4">MP4</span></label>
          <label class="opt-item"><input type="checkbox" id="tikMp3"><i class="fas fa-music"></i> <span data-i18n="tiktok_mp3">MP3</span></label>
          <label class="opt-item"><input type="checkbox" id="tikNoWatermark" checked><i class="fas fa-water"></i> <span data-i18n="tiktok_nowm">No WM</span></label>
        </div>
        <div class="tik-download-note"><i class="fas fa-check-circle"></i> <span data-i18n="tiktok_note">Có thể tải xuống cả MP3 &amp; MP4</span></div>
        <div class="tik-progress-wrap" id="tikProgressWrap">
          <div class="tik-progress-bar"><div class="tik-progress-fill" id="tikProgressFill"></div></div>
          <div class="tik-progress-text"><span id="tikProgressLabel" data-i18n="tiktok_loading">Đang tải...</span><span class="tik-percent" id="tikPercentLabel">0%</span></div>
        </div>
        <div class="tik-batch-status" id="tikBatchStatus"></div>
        <div class="tik-batch-summary" id="tikBatchSummary"></div>
        <div class="tik-api-status">
          <span class="api-dot"></span>
          <span class="api-label">API:</span>
          <span class="api-name" id="apiEndpointDisplay">Gateway</span>
          <span class="api-arrow">•</span>
          <span class="api-badge">Thwih</span>
        </div>
        <div class="tik-error" id="tikError"></div>
        <div class="tik-result" id="tikResult">
          <div class="tik-thumb" id="tikThumb"></div>
          <div class="tik-info"><div class="tik-title" id="tikTitle"></div><div class="tik-author" id="tikAuthor"></div></div>
          <div class="tik-actions" id="tikActions"></div>
        </div>
      </div>
    </div>
  `;
}