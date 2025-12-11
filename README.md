Dưới đây là một bản `README.md` chi tiết và chuyên nghiệp dành cho dự án Frontend **"Eturoring"** của bạn, dựa trên cấu trúc và mã nguồn đã phân tích.

Bạn có thể tạo một file tên là `README.md` trong thư mục gốc của dự án và dán nội dung này vào.

-----

# 🎓 Eturoring - Hệ Thống Quản Lý & Tương Tác Đào Trực Tuyến (Frontend)

**Eturoring** là giao diện người dùng (Client-side) cho hệ thống quản lý trung tâm đào tạo/gia sư. Dự án được xây dựng hiện đại với **Vue 3** và **Vite**, cung cấp trải nghiệm mượt mà cho cả Quản trị viên (Admin), Gia sư (Tutor) và Học viên (Student).

Hệ thống kết nối với Backend API (.NET 8) để cung cấp các tính năng quản lý học vụ, thời khóa biểu và giao tiếp thời gian thực.

## 🚀 Tính Năng Nổi Bật

### 🔐 1. Xác thực & Phân quyền

  * **Đăng nhập/Đăng xuất:** Bảo mật với JWT Token.
  * **Quên mật khẩu:** Quy trình khôi phục mật khẩu qua Email.
  * **Phân quyền chặt chẽ:** Giao diện và chức năng thay đổi tùy theo vai trò (Admin, Tutor, Student).

### 🛠️ 2. Dành cho Quản trị viên (Admin)

  * **Dashboard:** Xem thống kê tổng quan (số lượng học sinh, gia sư, lớp học) và biểu đồ tăng trưởng.
  * **Quản lý Người dùng:** Thêm, sửa, xóa, xem hồ sơ Học sinh và Gia sư.
  * **Quản lý Đào tạo:**
      * CRUD (Thêm/Sửa/Xóa) Môn học (Subject).
      * Quản lý Phòng học (Classroom).
      * Tạo và quản lý Lớp học (Class), gán Gia sư và Học viên.
  * **Xếp lịch (Scheduling):** Tạo lịch học đơn lẻ hoặc lịch lặp lại (Recurring) tự động hàng tuần.

### 👩‍🏫 3. Dành cho Gia sư & Học viên

  * **Lớp học của tôi:** Xem danh sách lớp học đang tham gia/giảng dạy.
  * **Thời khóa biểu cá nhân:** Xem lịch học chi tiết, tích hợp link tham gia lớp học trực tuyến (Google Meet/Zoom).
  * **Blog & Tin tức:** Đăng bài viết chia sẻ kiến thức, hỗ trợ upload ảnh/PDF và bình luận tương tác.

### 💬 4. Giao tiếp Thời gian thực (Real-time)

  * **Chat 1-1:** Nhắn tin trực tiếp giữa Gia sư và Học sinh (tích hợp SignalR).
  * **Thông báo (Notifications):** Nhận thông báo tức thì khi có tin nhắn mới hoặc bình luận mới.

-----

## 🛠️ Công Nghệ Sử Dụng

Dự án sử dụng các thư viện và công nghệ tiên tiến nhất trong hệ sinh thái Vue.js:

  * **Core:** [Vue 3](https://vuejs.org/) (Composition API, `<script setup>`)
  * **Build Tool:** [Vite](https://vitejs.dev/) (Tốc độ khởi động và HMR cực nhanh)
  * **Routing:** [Vue Router 4](https://router.vuejs.org/)
  * **HTTP Client:** [Axios](https://axios-http.com/)
  * **Real-time:** [@microsoft/signalr](https://www.npmjs.com/package/@microsoft/signalr)
  * **Biểu đồ:** [Chart.js](https://www.chartjs.org/) & [vue-chartjs](https://vue-chartjs.org/)
  * **UI Components:**
      * [Vue Multiselect](https://vue-multiselect.js.org/) (Dropdown chọn nhiều)
      * CSS thuần (Scoped CSS)

-----

## ⚙️ Cài Đặt & Chạy Dự Án

### 1\. Yêu cầu hệ thống

  * [Node.js](https://nodejs.org/) (Phiên bản 18 trở lên khuyến nghị)
  * Trình quản lý gói `npm` hoặc `yarn`.

### 2\. Cài đặt dependencies

Mở terminal tại thư mục gốc của dự án và chạy:

```bash
npm install
# Hoặc
yarn install
```

### 3\. Chạy môi trường phát triển (Development)

Để chạy dự án ở chế độ dev (hot-reload):

```bash
npm run dev
```

Truy cập trình duyệt tại địa chỉ hiển thị trên terminal (thường là `http://localhost:5173`).

### 4\. Đóng gói (Build Production)

Để build dự án ra file tĩnh cho môi trường production:

```bash
npm run build
```

-----

## 📂 Cấu Trúc Thư Mục

```
src/
├── api/                # Các services gọi API (tách biệt logic mạng)
│   ├── authService.js
│   ├── classService.js
│   ├── signalr.js      # Cấu hình Chat Hub
│   └── ...
├── assets/             # Hình ảnh, CSS global
├── components/         # Các Vue Components tái sử dụng (Layout, Form,...)
├── views/              # Các trang chính (Login, Home,...)
│   ├── Admin_views/    # Giao diện dành cho Admin
│   ├── Student_views/  # Giao diện dành cho Student
│   ├── Tutor_views/    # Giao diện dành cho Tutor
│   ├── Schedule_views/ # Giao diện lịch học
│   └── Chat/           # Giao diện Chat
├── router/             # Cấu hình Vue Router & Navigation Guards
├── helpers/            # Các hàm tiện ích (Decode Token,...)
├── App.vue             # Component gốc
└── main.js             # Entry point
```

-----

## ⚠️ Lưu ý Cấu hình (Configuration)

Hiện tại, **API Base URL** đang được cấu hình trực tiếp trong các file service tại thư mục `src/api/`.

Ví dụ trong `src/api/authService.js`:

```javascript
const BASE_API_URL = "https://projectcomp1640-asfhatcmhzf6hghg.eastasia-01.azurewebsites.net/api";
```

Nếu bạn muốn chạy với Backend cục bộ (Localhost) hoặc môi trường khác, hãy tìm và thay thế URL này hoặc tốt hơn là chuyển nó vào file biến môi trường `.env`.

**Ví dụ file `.env`:**

```env
VITE_API_BASE_URL=http://localhost:5241/api
```

-----

## 🤝 Đóng Góp

Mọi đóng góp đều được hoan nghênh\! Nếu bạn tìm thấy lỗi hoặc muốn cải thiện tính năng:

1.  Fork dự án.
2.  Tạo branch mới (`git checkout -b feature/AmazingFeature`).
3.  Commit thay đổi (`git commit -m 'Add some AmazingFeature'`).
4.  Push lên branch (`git push origin feature/AmazingFeature`).
5.  Tạo Pull Request.

-----

## 📄 Bản quyền

Dự án này được phát triển cho mục đích học tập (Project Comp1640).
