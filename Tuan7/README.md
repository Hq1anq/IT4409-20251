# Ứng dụng "Tra cứu kết quả học tập" được xây dựng bằng React + Vite.

## Thành phần chính

- **App.jsx**: Quản lý toàn bộ **state** của ứng dụng gồm:  
  `studentId`, `student`, `results`, `hocphan`, `isLoading`, `error`.
- **SearchForm.jsx**, **ResultTable.jsx**, **Loading.jsx**: Các component con chỉ nhận dữ liệu từ `props`, **không quản lý state riêng**.
- **useEffect** trong App được **kích hoạt khi giá trị `studentId` thay đổi**,  
  tức là khi người dùng nhập mã số sinh viên và nhấn “Tra cứu”.
- Khi kích hoạt, **useEffect thực hiện fetch dữ liệu từ 3 file JSON** (`sinhvien.json`, `hocphan.json`, `ketqua.json`) trong thư mục `public/`.
- Sau khi dữ liệu được tải, giao diện tự động hiển thị kết quả, báo lỗi, hoặc trạng thái đang tải.
