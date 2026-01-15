# 📧 HƯỚNG DẪN CHI TIẾT LẤY SERVICE ID, TEMPLATE ID VÀ PUBLIC KEY

## 🎯 Tổng quan
Bạn cần 3 giá trị này từ EmailJS:
1. **Service ID** - ID của email service (Gmail)
2. **Template ID** - ID của email template
3. **Public Key** - Key công khai để xác thực

---

## 📝 BƯỚC 1: ĐĂNG KÝ VÀ ĐĂNG NHẬP

1. Truy cập: **https://www.emailjs.com/**
2. Click nút **"Sign Up"** (góc trên bên phải)
3. Đăng ký bằng Gmail hoặc email khác
4. Xác nhận email và đăng nhập

---

## 🔧 BƯỚC 2: LẤY SERVICE ID

### Cách làm:

1. **Sau khi đăng nhập**, bạn sẽ thấy Dashboard
2. Ở menu bên trái, click **"Email Services"**
3. Click nút **"Add New Service"** (màu xanh)
4. Chọn **"Gmail"** từ danh sách
5. Click **"Connect Account"** và đăng nhập Gmail của bạn
6. Sau khi kết nối thành công, bạn sẽ thấy:
   - Tên service (ví dụ: "Gmail")
   - **Service ID** ngay bên dưới (ví dụ: `service_abc123xyz`)
   
### 📍 Vị trí Service ID:
```
┌─────────────────────────────┐
│ Gmail                       │
│ Service ID: service_abc123  │ ← COPY CÁI NÀY
└─────────────────────────────┘
```

**Copy Service ID này** (thường bắt đầu bằng `service_`)

---

## 📄 BƯỚC 3: LẤY TEMPLATE ID

### Cách làm:

1. Ở menu bên trái, click **"Email Templates"**
2. Click nút **"Create New Template"**
3. Điền thông tin template:

   **Template Name:** `RSVP Notification` (hoặc tên bạn muốn)

   **Subject (Tiêu đề email):**
   ```
   Xác nhận tham dự từ {{from_name}} - Thiệp mời Tốt Nghiệp
   ```

   **Content (Nội dung email):**
   ```
   Chào {{to_name}},

   Bạn có một xác nhận tham dự mới từ thiệp mời tốt nghiệp:

   👤 Tên người gửi: {{from_name}}
   💌 Lời chúc: {{message}}
   ✅ Xác nhận tham dự: {{attendance}}
   📅 Thời gian gửi: {{date}}

   ---
   Thiệp mời Tốt Nghiệp - Lê Thị Ngọc Thúy
   ```

4. Ở phần **"To Email"**, chọn email của bạn (email đã kết nối ở Bước 2)
5. Click **"Save"** để lưu template
6. Sau khi lưu, bạn sẽ thấy **Template ID** ở trên cùng của trang

### 📍 Vị trí Template ID:
```
┌─────────────────────────────────────┐
│ Template ID: template_xyz789        │ ← COPY CÁI NÀY
│ Template Name: RSVP Notification     │
└─────────────────────────────────────┘
```

**Copy Template ID này** (thường bắt đầu bằng `template_`)

---

## 🔑 BƯỚC 4: LẤY PUBLIC KEY

### Cách làm:

1. Ở menu bên trái, click **"Account"**
2. Chọn tab **"General"**
3. Cuộn xuống phần **"API Keys"**
4. Bạn sẽ thấy **"Public Key"** (còn gọi là "Public API Key")

### 📍 Vị trí Public Key:
```
┌─────────────────────────────┐
│ API Keys                    │
│                             │
│ Public Key:                 │
│ abcdefghijklmnopqrstuvwxyz  │ ← COPY CÁI NÀY
│                             │
│ [Show] [Copy]               │
└─────────────────────────────┘
```

**Click nút "Copy"** hoặc copy trực tiếp Public Key này

---

## ✅ BƯỚC 5: CẬP NHẬT CODE

1. Mở file `js/main.js`
2. Tìm đến dòng khoảng **156-158**:
   ```javascript
   const EMAILJS_CONFIG = {
     serviceID: 'YOUR_SERVICE_ID',
     templateID: 'YOUR_TEMPLATE_ID',
     publicKey: 'YOUR_PUBLIC_KEY'
   };
   ```

3. Thay thế các giá trị:

   **Ví dụ:**
   ```javascript
   const EMAILJS_CONFIG = {
     serviceID: 'service_abc123xyz',        // ← Dán Service ID vào đây
     templateID: 'template_xyz789',         // ← Dán Template ID vào đây
     publicKey: 'abcdefghijklmnopqrstuv'    // ← Dán Public Key vào đây
   };
   ```

4. **Lưu file** (Ctrl+S hoặc Cmd+S)

---

## 🧪 BƯỚC 6: TEST THỬ

1. Mở trang web của bạn trong trình duyệt
2. Điền form RSVP:
   - Tên: Test
   - Lời chúc: Đây là test
   - Xác nhận: Chọn một lựa chọn
3. Click **"GỬI NGAY!"**
4. Kiểm tra email của bạn (có thể trong thư mục Spam)
5. Nếu nhận được email = **THÀNH CÔNG!** ✅

---

## ⚠️ LƯU Ý QUAN TRỌNG

1. **Service ID** phải bắt đầu bằng `service_`
2. **Template ID** phải bắt đầu bằng `template_`
3. **Public Key** là một chuỗi dài các ký tự (không có khoảng trắng)
4. Đảm bảo **không có dấu ngoặc kép thừa** khi copy
5. Email có thể vào thư mục **Spam**, nhớ kiểm tra!

---

## 🆘 NẾU GẶP LỖI

### Lỗi: "EmailJS chưa được tải"
- Kiểm tra kết nối internet
- Kiểm tra xem script EmailJS đã được thêm vào HTML chưa

### Lỗi: "Invalid service ID"
- Kiểm tra lại Service ID đã copy đúng chưa
- Đảm bảo Service đã được kết nối thành công

### Lỗi: "Invalid template ID"
- Kiểm tra lại Template ID đã copy đúng chưa
- Đảm bảo Template đã được lưu thành công

### Không nhận được email:
- Kiểm tra thư mục Spam
- Kiểm tra email trong Email Service đã đúng chưa
- Mở Console (F12) để xem lỗi chi tiết

---

## 📞 HỖ TRỢ

Nếu vẫn gặp khó khăn:
1. Xem Console trong trình duyệt (F12 → Console)
2. Kiểm tra lại các ID và Key đã nhập đúng chưa
3. Thử tạo lại Service và Template

**Chúc bạn thành công! 🎉**
