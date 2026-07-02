export function renderApple() {
  return `
    <div class="apple-rent-section" id="appleRentSection">
      <div class="section-title"><i class="fab fa-apple"></i> <span data-i18n="apple_title">Thuê ID Apple – Tải FL Studio</span></div>
      <div class="apple-rent-card">
        <div class="apple-rent-header">
          <div class="app-icon"><i class="fab fa-apple"></i></div>
          <div class="app-info"><h3>FL Studio Mobile</h3><div class="app-dev">Image Line Software</div></div>
        </div>
        <div class="apple-rent-body">
          <div class="rent-item"><div class="label" data-i18n="apple_price_label">Giá thuê</div><div class="value price">15.000đ</div></div>
          <div class="rent-item"><div class="label" data-i18n="apple_device_label">Thiết bị</div><div class="value" data-i18n="apple_device_value">iPhone / iPad</div></div>
        </div>
        <div class="apple-rent-note"><i class="fas fa-info-circle"></i> <span data-i18n="apple_note">Nhận ID Apple ngay sau thanh toán. Hỗ trợ đăng nhập và tải ứng dụng.</span></div>
        <div class="apple-rent-footer">
          <a href="https://zalo.me/84338578255" target="_blank" class="btn-rent"><i class="fas fa-comment-dots"></i> <span data-i18n="apple_contact_zalo">Liên hệ Zalo</span></a>
        </div>
      </div>
    </div>
  `;
}