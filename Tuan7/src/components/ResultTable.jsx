export default function ResultTable({ results = [], hocphan = [], diemChuFn }) {
	return (
		<table className="result-table">
			<thead>
				<tr>
					<th>Mã HP</th>
					<th>Tên học phần</th>
					<th>Số TC</th>
					<th>Học kỳ</th>
					<th>Điểm (10)</th>
					<th>Điểm chữ</th>
				</tr>
			</thead>
			<tbody>
				{results.map((r) => {
					const hp = hocphan.find((h) => h.cid === r.cid);
					// key duy nhất: kết hợp cid + term (đảm bảo unique)
					const key = `${r.cid}-${r.term}`;
					return (
						<tr key={key}>
							<td>{r.cid}</td>
							<td>{hp ? hp.name : ""}</td>
							<td>{hp ? hp.credits : ""}</td>
							<td>{r.term}</td>
							<td>{r.score}</td>
							<td>{diemChuFn ? diemChuFn(r.score) : ""}</td>
						</tr>
					);
				})}
			</tbody>
		</table>
	);
}
