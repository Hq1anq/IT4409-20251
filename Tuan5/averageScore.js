function calcAverage(students) {
    let sumScore = 0, count = 0;
    students.forEach(student => {
        sumScore += student.score;
        count++;
    });
    return sumScore/count;
}

const value = calcAverage([
    {
        name: "Tuan",
        score: 8
    },
    {
        name: "Toan",
        score: 9
    },
    {
        name: "Khanh",
        score: 9
    }
])

console.log(value);