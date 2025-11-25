const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// 데이터 파일
const dataFile = path.join(__dirname, "attendance.json");

// 데이터 읽기
function loadData() {
  if (!fs.existsSync(dataFile)) return [];
  return JSON.parse(fs.readFileSync(dataFile, "utf8"));
}

// 데이터 저장
function saveData(data) {
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
}

// ============================
// 1. 전체 조회 GET
// ============================
app.get("/attendance", (req, res) => {
  const data = loadData();
  res.json(data);
});

// ============================
// 2. 새 출석 저장 POST
// ============================
app.post("/attendance", (req, res) => {
  const { date, name } = req.body;
  if (!date || !name) return res.status(400).json({ message: "date와 name 필요" });

  let data = loadData();
  const newRecord = {
    id: Date.now().toString(), // unique id
    date,
    name
  };
  data.push(newRecord);
  saveData(data);

  res.json(newRecord);
});

// ============================
// 3. 수정 PUT
// ============================
app.put("/attendance/:id", (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  let data = loadData();
  const target = data.find(item => item.id === id);
  if (!target) return res.status(404).json({ message: "데이터 없음" });

  target.name = name;
  saveData(data);
  res.json({ message: "수정 완료" });
});

// ============================
// 4. 삭제 DELETE
// ============================
app.delete("/attendance/:id", (req, res) => {
  const { id } = req.params;

  let data = loadData();
  data = data.filter(item => item.id !== id);
  saveData(data);

  res.json({ message: "삭제 완료" });
});

// 서버 시작
app.listen(PORT, () => {
  console.log("서버 실행중:", PORT);
});