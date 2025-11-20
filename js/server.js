const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = 3000;

app.use(express.json());

// 출석 데이터 저장할 파일 경로
const dataFile = path.join(__dirname, "attendance.json");

// 출석 저장 API
app.post("/attendance", (req, res) => {
  const { date, name } = req.body;

  if (!date || !name) {
    return res.status(400).json({ message: "date와 name은 필수입니다." });
  }

  // 기존 데이터 읽기 (없으면 빈 배열)
  let attendanceData = [];
  if (fs.existsSync(dataFile)) {
    attendanceData = JSON.parse(fs.readFileSync(dataFile, "utf8"));
  }

  // 새 기록 추가
  attendanceData.push({ date, name });

  // 파일에 저장
  fs.writeFileSync(dataFile, JSON.stringify(attendanceData, null, 2));

  res.json({ message: "출석 저장 완료!" });
});

// 서버 시작
app.listen(PORT, () => {
  console.log("서버 실행중:", PORT);
});