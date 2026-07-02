export function renderModal() {
  return `
    <div class="modal-overlay" id="modalOverlay">
      <div class="modal-box">
        <h3 data-i18n="notification_title">Thông Báo</h3>
        <p data-i18n="notification_content">Nếu mọi người lấy Nhạc thì mọi người bấm vào các Liên Kết bên dưới để vào Group lấy nhạc.</p>
        <button class="btn-close-modal" id="closeModalBtn" data-i18n="understood">Đã hiểu</button>
      </div>
    </div>
  `;
}