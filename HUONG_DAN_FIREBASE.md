# Hướng dẫn cấu hình Firebase để hiển thị lời chúc công khai

## Mục đích
Sau khi cấu hình Firebase, tất cả lời chúc của mọi người sẽ được lưu trữ và hiển thị công khai trên website. Mọi người vào link đều có thể xem được tất cả lời chúc.

## Bước 1: Tạo Firebase Project

1. Truy cập https://console.firebase.google.com/
2. Đăng nhập bằng tài khoản Google
3. Click **"Add project"** hoặc **"Tạo dự án"**
4. Nhập tên project (ví dụ: `thiep-moi-tot-nghiep`)
5. Click **"Continue"**
6. Tắt Google Analytics (không bắt buộc) hoặc bật nếu muốn
7. Click **"Create project"**
8. Đợi Firebase tạo project xong, click **"Continue"**

## Bước 2: Tạo Realtime Database

1. Trong Firebase Console, click vào **"Realtime Database"** ở menu bên trái
2. Click **"Create database"**
3. Chọn location gần nhất (ví dụ: `asia-southeast1` - Singapore)
4. Click **"Next"**
5. Chọn **"Start in test mode"** (cho phép đọc/ghi công khai)
6. Click **"Enable"**
7. Sau khi database được tạo, bạn sẽ thấy URL dạng:
   ```
   https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com/
   ```
   Copy URL này để dùng ở bước sau

## Bước 3: Lấy Firebase Config

1. Trong Firebase Console, click vào biểu tượng **⚙️ Settings** (Cài đặt) ở góc trên bên trái
2. Chọn **"Project settings"**
3. Scroll xuống phần **"Your apps"**
4. Click vào biểu tượng **`</>`** (Web) để thêm Web app
5. Đặt tên app (ví dụ: `Thiep Moi Tot Nghiep`)
6. **KHÔNG** tích vào "Also set up Firebase Hosting"
7. Click **"Register app"**
8. Bạn sẽ thấy đoạn code config như sau:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIza...",
     authDomain: "your-project.firebaseapp.com",
     databaseURL: "https://your-project-default-rtdb.firebaseio.com",
     projectId: "your-project",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abcdef"
   };
   ```
https://thumoithamduletotnghiep-default-rtdb.asia-southeast1.firebasedatabase.app/
## Bước 4: Cập nhật Config vào code

1. Mở file `js/main.js`
2. Tìm phần `FIREBASE_CONFIG` (khoảng dòng 10-20)
3. Thay thế các giá trị bằng thông tin từ Firebase Console:

```javascript
const FIREBASE_CONFIG = {
  apiKey: "AIza...",  // Copy từ Firebase Console
  authDomain: "your-project.firebaseapp.com",  // Copy từ Firebase Console
  databaseURL: "https://your-project-default-rtdb.firebaseio.com/",  // URL của Realtime Database
  projectId: "your-project",  // Copy từ Firebase Console
  storageBucket: "your-project.appspot.com",  // Copy từ Firebase Console
  messagingSenderId: "123456789",  // Copy từ Firebase Console
  appId: "1:123456789:web:abcdef"  // Copy từ Firebase Console
};
```

**Lưu ý quan trọng:**
- `databaseURL` phải có dấu `/` ở cuối
- Copy chính xác từng giá trị, không được sai

## Bước 5: Cấu hình Database Rules (Bảo mật)

1. Vào **Realtime Database** → Tab **"Rules"**
2. Thay đổi rules thành:

```json
{
  "rules": {
    "messages": {
      ".read": true,
      ".write": true,
      ".indexOn": "timestamp"
    }
  }
}
```

3. Click **"Publish"**

**Giải thích:**
- `.read: true` - Cho phép mọi người đọc lời chúc
- `.write: true` - Cho phép mọi người gửi lời chúc
- `.indexOn: "timestamp"` - Tối ưu truy vấn theo thời gian

## Bước 6: Test thử

1. Lưu file `js/main.js`
2. Push code lên GitHub:
   ```bash
   git add .
   git commit -m "Add Firebase integration for public messages"
   git push
   ```
3. Đợi vài phút để GitHub Pages cập nhật
4. Mở website và thử gửi một lời chúc
5. Kiểm tra xem lời chúc có hiển thị không

## Kiểm tra Firebase Console

Sau khi có người gửi lời chúc, bạn có thể vào Firebase Console → Realtime Database để xem dữ liệu:
- Mỗi lời chúc sẽ có một ID tự động
- Dữ liệu bao gồm: name, message, attendance, attendanceText, timestamp

## Troubleshooting (Xử lý lỗi)

### Lỗi: "Firebase chưa được khởi tạo"
- Kiểm tra lại FIREBASE_CONFIG có đúng không
- Kiểm tra console browser (F12) xem có lỗi gì không

### Lỗi: "Permission denied"
- Kiểm tra Database Rules đã được publish chưa
- Đảm bảo rules cho phép read và write

### Lời chúc không hiển thị
- Mở Developer Tools (F12) → Console để xem lỗi
- Kiểm tra databaseURL có đúng không (phải có `/` ở cuối)
- Kiểm tra Firebase project có đang hoạt động không

## Lưu ý bảo mật

⚠️ **Quan trọng:** Database hiện đang ở chế độ test mode, cho phép mọi người đọc và ghi. Điều này phù hợp cho mục đích hiển thị lời chúc công khai. Nếu bạn muốn bảo mật hơn (ví dụ chỉ cho phép đọc, không cho phép ghi), bạn có thể thay đổi rules sau.

## Hỗ trợ

Nếu gặp vấn đề, kiểm tra:
1. Console browser (F12) để xem lỗi cụ thể
2. Firebase Console → Realtime Database → Data để xem dữ liệu có được lưu không
3. Network tab trong Developer Tools để xem request có thành công không
