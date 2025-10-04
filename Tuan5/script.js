const rawData = [
    [20241, "SSH1141",  "Lịch sử Đảng cộng sản Việt Nam",               2, "B+"],
    [20241, "SSH1131",  "Chủ nghĩa xã hội khoa học",                    2, "C"],
    [20241, "PH1120",   "Vật lý đại cương II",                          3, "B+"],
    [20241, "PE2301",   "Bóng rổ 1",                                    0, "D"],
    [20241, "MI3052",   "Nhập môn các phương pháp tối ưu",              2, "D"],
    [20241, "MI2020",   "Xác suất thống kê",                            3, "B"],
    [20241, "ME3123",   "Thiết kế mỹ thuật công nghiệp",                2, "A+"],
    [20241, "IT3100",   "Lập trình hướng đối tượng",                    2, "B"],
    [20241, "IT3080",   "Mạng máy tính",                                3, "B"],
    [20241, "IT3030",   "Kiến trúc máy tính",                           3, "A"],
    [20242,	"SSH1151",  "Tư tưởng Hồ Chí Minh",                         2, "F"],
    [20242,	"PE2261",   "Karatedo",                                     0, "B"],
    [20242,	"PE2251",   "Taekwondo 1",                                  0, "C"],
    [20242,	"MI1131",   "Giải tích III",                                3, "C+"],
    [20242,	"IT3160",   "Nhập môn Trí tuệ nhân tạo",                    3, "A"],
    [20242,	"IT3090",   "Cơ sở dữ liệu",                                3, "A"],
    [20242,	"IT3070",   "Nguyên lý hệ điều hành",                       3, "B"],
    [20242,	"IT2030",   "Technical Writing and Presentation",           3, "B+"],
    [20242,	"EM1180",   "Văn hóa kinh doanh và tinh thần khởi nghiệp",  2, "A"],
];

const gradeMap = {
    "A+": 4,
    "A": 4,
    "B+": 3.5,
    "B": 3,
    "C+": 2.5,
    "C": 2,
    "D+": 1.5,
    "D": 1,
    "F": 0
};

const data = rawData.map(row => {
    const textPoint = row[4];
    const numPoint = gradeMap[textPoint];
    // Insert numPoint between credit and textPoint
    const newRow = [...row.slice(0, 4), numPoint, textPoint];
    return newRow;
});

const elements = {
    tbody: document.querySelector("tbody"),
    highlightBtn: document.getElementById("highlightBtn"),
    calcGPAbtn: document.getElementById("calcGPAbtn"),
    gpaDisplay: document.getElementById("gpaDisplay"),
    filterBtn: document.getElementById("filterBtn"),
    sortBtn: document.getElementById("sortBtn")
};

function insertData(data) {
    data.forEach(row => {
        const tr = document.createElement('tr');
        let rowHTML = ``;
        
        for (let i = 0; i < row.length; i++) {
            if (i == 1 || i == 2)
                rowHTML += `<td style="text-align: left">${row[i]}</td>`;
            else
                rowHTML += `<td>${row[i]}</td>`;
        }

        tr.innerHTML = rowHTML;
        elements.tbody.appendChild(tr);
    });
}

function colorTable(event) {
    const rows = elements.tbody.rows;
    const buttonText = event.target.textContent.trim();

    if (buttonText == "Highlight") {
        for (let row of rows) {
            const textPoint = row.cells[5]?.textContent.trim();
            if (textPoint === "A" || textPoint === "A+") {
                row.style.backgroundColor = "lightgreen";
            } else if (textPoint === "F") {
                row.style.backgroundColor = "black";
                row.style.color = "white";
            }
        }
        event.target.textContent = "UnHighlight";
    }
    else { // restore
        for (let row of rows) {
            row.style.backgroundColor = "";
            row.style.color = "";
        }
        event.target.textContent = "Highlight";
    }
}

function calcGPA() {
    let point1 = 0, credit1 = 0;
    let point2 = 0, credit2 = 0;
    data.forEach(row => {
        if (row[0] == 20241) {
            point1 += row[4] * row[3];
            credit1 += row[3];
        }
        else if (row[0] == 20242) {
            point2 += row[4] * row[3];
            credit2 += row[3];
        }
    });
    const gpa1 = point1 / credit1;
    const gpa2 = point2 / credit2;
    gpaDisplay.style.display = "block";
    gpaDisplay.querySelector("tbody").innerHTML = `
        <tr>
            <td>20241</td>
            <td>${gpa1.toFixed(1)}</td>
        </tr>
        <tr>
            <td>20242</td>
            <td>${gpa2.toFixed(1)}</td>
        </tr>    
    `;
}

function filterA(event) {
    const rows = elements.tbody.rows;
    const buttonText = event.target.textContent.trim();

    if (buttonText == "Filter") {
        for (let row of rows) {
            if (row.cells[4].textContent.trim() != "4")
                row.style.display = "none";
        }
        event.target.textContent = "Restore";
    } else {
        for (let row of rows) {
            if (row.cells[4].textContent.trim() != "4")
                row.style.display = "table-row";
        }
        event.target.textContent = "Filter";
    }
}

function sortByPointAsc() {
    const pointMap = {
        "F": 0,
        "D": 1,
        "D+": 1.5,
        "C": 2,
        "C+": 2.5,
        "B": 3,
        "B+": 3.5,
        "A": 4,
        "A+": 4.1
    }

    elements.tbody.innerHTML = "";

    insertData(data.sort((a, b) => {
        return pointMap[a[5]] - pointMap[b[5]];
    }));

    elements.highlightBtn.textContent = "Highlight";
    elements.filterBtn.textContent = "Filter";
}

function initTable() {
    insertData(data);
    elements.highlightBtn.addEventListener("click", colorTable);
    elements.calcGPAbtn.addEventListener("click", calcGPA);
    elements.filterBtn.addEventListener("click", filterA);
    elements.sortBtn.addEventListener("click", sortByPointAsc);
}

initTable();