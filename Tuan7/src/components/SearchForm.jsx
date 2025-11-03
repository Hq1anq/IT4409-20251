import { useState } from "react";

export default function SearchForm({ onSearch }) {
	const [sid, setSid] = useState("");

	function submit(e) {
		e.preventDefault();
		onSearch(sid);
	}

	return (
		<form className="search-box" onSubmit={submit}>
			<input
				type="text"
				placeholder="Nhập mã số sinh viên..."
				value={sid}
				onChange={(e) => setSid(e.target.value)}
			/>
			<button type="submit">Tra cứu 🔍</button>
			<p class="hint">(20235067, 202423058, 202527643, 20221904, 20232102)</p>
		</form>
	);
}
