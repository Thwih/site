# 🎵 Thwih Music

> **Kho nhạc miễn phí, tìm kiếm thông minh & thuê ID Apple FL Studio**

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live-blue?style=flat-square&logo=github)](https://your-username.github.io/thwih-music/)
[![GitHub license](https://img.shields.io/badge/license-MIT-green?style=flat-square)](LICENSE)

---

## 📌 Giới thiệu

**Thwih Music** là một ứng dụng web cho phép người dùng:
- 🔍 **Tìm kiếm nhạc** từ kho Google Drive.
- ⬇️ **Tải nhạc miễn phí** với cơ chế rút gọn link tự động (hỗ trợ vượt tường lửa).
- 🎧 **Nghe nhạc trực tuyến** với trình phát nhạc tích hợp (Playlist, tiến độ, chuyển bài).
- 🍎 **Thuê ID Apple** để tải FL Studio Mobile (hỗ trợ qua Zalo).

> ⚠️ **Lưu ý**: Trang web được mã hóa (Hex) để tránh bot quét nội dung, nhưng tự động giải mã khi mở. Người dùng KHÔNG cần nhập mật khẩu (trừ khi bạn triển khai bản AES có bảo vệ).

---

## 🚀 Tính năng nổi bật

| Tính năng               | Mô tả                                                                 |
|-------------------------|-----------------------------------------------------------------------|
| **Lấy nhạc 2026**       | Truy cập kho nhạc cập nhật liên tục qua Google Docs.                  |
| **Thư viện đa dạng**    | Hỗ trợ nhiều thể loại, không giới hạn số lượng bài hát.               |
| **Tìm kiếm thông minh** | Lọc bài hát theo tên ngay khi bạn nhập (real-time).                   |
| **Trình phát nhạc**     | Phát/Pause, tua tiến độ, chuyển bài, danh sách phát tùy chỉnh.        |
| **Tải xuống nhanh**     | Tạo link rút gọn (3 lần) tự động, mở tab mới để tải trực tiếp.        |
| **Dịch vụ Apple ID**    | Thuê ID Apple để tải FL Studio Mobile, hỗ trợ nhiệt tình qua Zalo.    |

---

## 🛠️ Công nghệ sử dụng

- **Frontend**: HTML5, CSS3 (Dark/Light theme), JavaScript (ES6+).
- **API Backend**: Cloudflare Worker (rút gọn link, lấy danh sách nhạc từ Google Drive).
- **Security**: Mã hóa Hex (Obfuscation) để bảo vệ mã nguồn khỏi bot kiểm duyệt.
- **Hosting**: GitHub Pages (hoàn toàn miễn phí).

---

## 📦 Cài đặt & Triển khai (Self-Hosting)

Nếu bạn muốn tự triển khai bản sao của dự án này:

1. **Clone repository**:
   ```bash
   git clone https://github.com/your-username/thwih-music.git
