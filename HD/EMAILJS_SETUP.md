# Hướng dẫn tích hợp EmailJS để nhận email khi có người gửi lời chúc

## Bước 1: Đăng ký tài khoản EmailJS

1. Truy cập: https://www.emailjs.com/
2. Đăng ký tài khoản miễn phí (200 email/tháng)
3. Đăng nhập vào dashboard

## Bước 2: Thêm Email Service

1. Vào **Email Services** → **Add New Service**
2. Chọn **Gmail** (hoặc email service khác)
3. Kết nối với Gmail của bạn
4. Copy **Service ID** (ví dụ: `service_xxxxx`)

## Bước 3: Tạo Email Template

1. Vào **Email Templates** → **Create New Template**
2. Đặt tên template (ví dụ: "RSVP Notification")
3. Thiết lập template như sau:

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

4. Lưu template và copy **Template ID** (ví dụ: `template_xxxxx`)

## Bước 4: Lấy Public Key

1. Vào **Account** → **General**
2. Copy **Public Key** (ví dụ: `xxxxxxxxxxxxx`)

## Bước 5: Cập nhật code

Mở file `js/main.js` và tìm dòng:

```javascript
const EMAILJS_CONFIG = {
  serviceID: 'YOUR_SERVICE_ID',      // Thay bằng Service ID
  templateID: 'YOUR_TEMPLATE_ID',    // Thay bằng Template ID
  publicKey: 'YOUR_PUBLIC_KEY'       // Thay bằng Public Key
};
```

Thay thế các giá trị:
- `YOUR_SERVICE_ID` → Service ID bạn đã copy ở Bước 2
- `YOUR_TEMPLATE_ID` → Template ID bạn đã copy ở Bước 3
- `YOUR_PUBLIC_KEY` → Public Key bạn đã copy ở Bước 4

Ví dụ:
```javascript
const EMAILJS_CONFIG = {
  serviceID: 'service_abc123',
  templateID: 'template_xyz789',
  publicKey: 'abcdefghijklmnop'
};
```

## Bước 6: Test

1. Mở trang web của bạn
2. Điền form và gửi thử
3. Kiểm tra email của bạn để xem có nhận được email không

## Lưu ý

- EmailJS miễn phí cho 200 email/tháng
- Nếu cần nhiều hơn, có thể nâng cấp gói trả phí
- Email sẽ được gửi đến địa chỉ email bạn đã kết nối trong Email Service

## Troubleshooting

Nếu không nhận được email:
1. Kiểm tra lại các ID và Key đã nhập đúng chưa
2. Kiểm tra spam/junk folder
3. Xem Console trong trình duyệt (F12) để xem lỗi
4. Đảm bảo Email Service đã được kết nối đúng
