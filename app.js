var express = require("express");
var app = express();
const { Pool } = require("pg");
const path = require("path");
var createError = require("http-errors");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");

// 환경 변수 로드
require("dotenv").config();

// PostgreSQL 데이터베이스 풀 설정
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Heroku에서 제공하는 데이터베이스 URL
  ssl: {
    rejectUnauthorized: false, // SSL 연결 구성 (Heroku 요구 사항에 따라 변경할 수 있음)
  },
});

// 라우터 설정
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var independentBookstoreRouter = require("./routes/independentBookstoreRoutes");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

// 미들웨어 설정
app.use(cors({ origin: ["http://localhost:3000"] }));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// 라우트 사용
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/bookstores", independentBookstoreRouter);

// 404 에러 핸들러
app.use(function (req, res, next) {
  next(createError(404));
});

// 일반 에러 핸들러
app.use(function (err, req, res, next) {
  // 로컬 환경에서만 에러 메시지 제공
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // 에러 페이지 렌더링
  res.status(err.status || 500);
  res.render("error");
});

// 서버 시작
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`서버가 ${port}번 포트에서 실행 중입니다.`);
});

module.exports = app;
