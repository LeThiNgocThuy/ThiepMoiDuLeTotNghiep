# Hướng dẫn đưa website lên GitHub Pages

## Bước 1: Tạo repository trên GitHub

1. Truy cập https://github.com và đăng nhập vào tài khoản của bạn
2. Click vào nút **"+"** ở góc trên bên phải, chọn **"New repository"**
3. Đặt tên repository là: **`totnghiepngocthuy`**
4. Chọn **Public** (để GitHub Pages miễn phí)
5. **KHÔNG** tích vào "Initialize this repository with a README"
6. Click **"Create repository"**

## Bước 2: Push code lên GitHub

Sau khi tạo repository, GitHub sẽ hiển thị hướng dẫn. Chạy các lệnh sau trong terminal:

```bash
cd /Users/quangkhanh/WEBTNNT
git remote add origin https://github.com/TEN_USERNAME_GITHUB/totnghiepngocthuy.git
git branch -M main
git push -u origin main
```

**Lưu ý:** Thay `TEN_USERNAME_GITHUB` bằng username GitHub của bạn.

Ví dụ: Nếu username của bạn là `ngocthuy`, thì lệnh sẽ là:
```bash
git remote add origin https://github.com/ngocthuy/totnghiepngocthuy.git
```

## Bước 3: Bật GitHub Pages

1. Vào repository vừa tạo trên GitHub
2. Click vào tab **"Settings"** (ở menu trên cùng)
3. Scroll xuống phần **"Pages"** (ở menu bên trái)
4. Ở phần **"Source"**, chọn branch **"main"** và folder **"/ (root)"**
5. Click **"Save"**
6. Đợi vài phút, GitHub sẽ tự động tạo link cho bạn

## Link truy cập website

Sau khi bật GitHub Pages, website của bạn sẽ có link:
```
https://TEN_USERNAME_GITHUB.github.io/totnghiepngocthuy
```

Ví dụ: Nếu username của bạn là `ngocthuy`, link sẽ là:
```
https://ngocthuy.github.io/totnghiepngocthuy
```

## Lưu ý quan trọng

- Link sẽ mất vài phút để hoạt động sau khi bật GitHub Pages
- Nếu bạn thay đổi code, chỉ cần commit và push lại:
  ```bash
  git add .
  git commit -m "Mô tả thay đổi"
  git push
  ```
- Website sẽ tự động cập nhật sau vài phút khi bạn push code mới
