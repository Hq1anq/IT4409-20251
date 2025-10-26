const elements = {
	tbody: document.querySelector("tbody"),
	searchBtn: document.getElementById("searchBtn"),
	sidInput: document.getElementById("sidInput"),
	studentInfo: document.getElementById("studentInfo")
}

function diemChu(score) {
	if (score >= 9.5) return "A+";
	if (score >= 8.5) return "A";
	if (score >= 8.0) return "B+";
	if (score >= 7.0) return "B";
	if (score >= 6.5) return "C+";
	if (score >= 5.5) return "C";
	if (score >= 5.0) return "D+";
	if (score >= 4.0) return "D";
	return "F";
}

function showStudentInfo(student) {
	const infoDiv = elements.studentInfo;
	if (!student) {
		infoDiv.innerHTML = "";
		return;
	}
	infoDiv.innerHTML = `
		<strong>MSSV:</strong> ${student.sid} &nbsp; | &nbsp;
		<strong>Họ tên:</strong> ${student.name} &nbsp; | &nbsp;
		<strong>Ngày sinh:</strong> ${student.dob}
	`;
}

function showResults(results, hocphan) {
	elements.tbody.innerHTML = "";

	results.forEach(r => {
		const hp = hocphan.find(h => h.cid === r.cid);
		const row = document.createElement("tr");
		row.innerHTML = `
			<td>${r.cid}</td>
			<td>${hp ? hp.name : ""}</td>
			<td>${hp ? hp.credits : ""}</td>
			<td>${r.term}</td>
			<td>${r.score}</td>
			<td>${diemChu(r.score)}</td>
		`;
		elements.tbody.appendChild(row);
	});
}

// 🔧 Hiển thị trạng thái
function setStatus(msg) {
	document.getElementById("status").textContent = msg;
}

// 🔧 Mô phỏng fetch JSON với độ trễ (giả lập server)
async function fetchData(url) {
	await new Promise(resolve => setTimeout(resolve, 500)); // Giả lập delay
	const response = await fetch(url);
	if (!response.ok) throw new Error(`Lỗi tải dữ liệu từ ${url}`);
	return response.json();
}

// 🔧 Hàm chính tra cứu
async function traCuu() {
	const sid = elements.sidInput.value.trim();
	if (!sid) {
		setStatus("Vui lòng nhập mã số sinh viên!");
		return;
	}

	setStatus("Đang tải dữ liệu...");
	
	const cacheKey = `result_${sid}`;
	const cached = localStorage.getItem(cacheKey);
	if (cached) {
		const data = JSON.parse(cached);
		showStudentInfo(data.student);
		showResults(data.results, data.hocphan);
		setStatus("Đã tải từ cache");
		return;
	}

	try {
		const [sinhvien, hocphan, ketqua] = await Promise.all([
			fetchData("data/sinhvien.json"),
			fetchData("data/hocphan.json"),
			fetchData("data/ketqua.json")
		]);

		const student = sinhvien.find(sv => sv.sid === sid);
		if (!student) throw new Error("Không tìm thấy sinh viên!");

		const results = ketqua.filter(kq => kq.sid === sid);
		if (results.length === 0) throw new Error("Sinh viên chưa có kết quả học tập!");

		showStudentInfo(student);
		showResults(results, hocphan);
		setStatus("Hoàn tất");

		// Lưu cache
		localStorage.setItem(cacheKey, JSON.stringify({ student, hocphan, results }));

	} catch (err) {
		showStudentInfo(null);
		elements.tbody.innerHTML = "";
		setStatus("Lỗi: " + err.message);
	}
}

// Sự kiện nút bấm
elements.searchBtn.addEventListener("click", traCuu);
elements.sidInput.addEventListener("keydown", e => {
	if (e.key === "Enter") traCuu();
});
