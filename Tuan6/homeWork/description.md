Giải thích cách xử lý bất đồng bộ:
Trong hàm fetchData(url) sử dụng "await new Promise(resolve => setTimeout(resolve, 500));" để giả lập delay thao tác lấy dữ liệu, async/await kết hợp với fetch() để tải dữ liệu JSON.
Từ hàm chính Tracuu() gọi:
const [sinhvien, hocphan, ketqua] = await Promise.all([
    fetchData("data/sinhvien.json"),
    fetchData("data/hocphan.json"),
    fetchData("data/ketqua.json")
]);
giúp gửi ba yêu cầu bất đồng bộ cùng lúc đến các tệp JSON chứa dữ liệu sinh viên, học phần và kết quả học tập.
Sau khi tải xong, mã JavaScript sẽ:
1. Tìm sinh viên theo sid trong sinhvien.json.
2. Lấy danh sách kết quả từ ketqua.json có cùng sid.
3. Dựa vào cid trong kết quả để truy thông tin chi tiết trong hocphan.json.
4. Hiển thị toàn bộ dữ liệu trong bảng, gồm Mã học phần, Tên học phần, Số tín chỉ, Học kỳ, Điểm số và Điểm chữ quy đổi.