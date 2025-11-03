import { useState, useEffect } from "react";
import SearchForm from "./components/SearchForm";
import ResultTable from "./components/ResultTable";
import LoadingIndicator from "./components/LoadingIndicator";
import "./App.css";

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

async function fetchData(url) {
	await new Promise((resolve) => setTimeout(resolve, 500)); // Giả lập delay
	const response = await fetch(url);
	if (!response.ok) throw new Error(`Lỗi tải dữ liệu từ ${url}`);
	return response.json();
}

function App() {
	const [studentId, setStudentId] = useState(""); // mã sinh viên đang được tra cứu (trigger)
	const [student, setStudent] = useState(null);
	const [results, setResults] = useState([]);
	const [hocphan, setHocphan] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");

	// useEffect: chạy khi studentId thay đổi (khi người dùng bấm "Tra cứu")
	useEffect(() => {
		if (!studentId) return;
		let cancelled = false;
		async function fetchAll() {
			setIsLoading(true);
			setError("");
			setStudent(null);
			setResults([]);
			setHocphan([]);
			try {
				// Giả lập delay
				await new Promise((r) => setTimeout(r, 500));
				const [sinhvienData, hocphanData, ketquaData] = await Promise.all([
					fetchData("/sinhvien.json"),
					fetchData("/hocphan.json"),
					fetchData("/ketqua.json"),
				]);

				const foundStudent = sinhvienData.find((s) => s.sid === studentId);
				if (!foundStudent) {
					setError("Không tìm thấy sinh viên!");
					setIsLoading(false);
					return;
				}

				const studentResults = ketquaData.filter((r) => r.sid === studentId);
				if (studentResults.length === 0) {
					setError("Sinh viên chưa có kết quả học tập!");
					setStudent(foundStudent);
					setIsLoading(false);
					return;
				}

				if (cancelled) return;

				setStudent(foundStudent);
				setResults(studentResults);
				setHocphan(hocphanData);
				setIsLoading(false);
			} catch (err) {
				if (!cancelled) {
					setError("Lỗi: " + err.message);
					setIsLoading(false);
				}
			}
		}
		fetchAll();
		return () => {
			cancelled = true; // cleanup effect cũ khi studentId đổi
		};
	}, [studentId]);

	// callback khi SearchForm submit
	function handleSearch(sid) {
		// bỏ khoảng trắng, set state studentId -> kích hoạt useEffect
		const trimmed = sid.trim();
		if (!trimmed) {
			setError("Vui lòng nhập mã số sinh viên!");
			return;
		}
		setStudentId(trimmed);
	}

	return (
		<>
			<h1>Tra cứu kết quả học tập sinh viên</h1>

			<SearchForm onSearch={handleSearch} />

			<div id="status">
				{isLoading && <LoadingIndicator />}
				{!isLoading && error && <div className="error">{error}</div>}
				{!isLoading && !error && student && (
					<div id="studentInfo">
						<strong>MSSV:</strong> {student.sid} &nbsp; | &nbsp;
						<strong>Họ tên:</strong> {student.name} &nbsp; | &nbsp;
						<strong>Ngày sinh:</strong> {student.dob}
					</div>
				)}
			</div>

			<ResultTable results={results} hocphan={hocphan} diemChuFn={diemChu} />
		</>
	);
}

export default App;
