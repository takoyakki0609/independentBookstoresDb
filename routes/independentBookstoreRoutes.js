var express = require("express");
var router = express.Router();
const { Pool } = require("pg");
const app = express();
const port = 8080;

// Node.js 코드
require("dotenv").config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});

app.get("/api/bookstores", async (req, res) => {
  const { lat, lng, radius } = req.query; // radius는 킬로미터 단위로 가정

  const query = `
    SELECT * FROM independentbookstores 
    WHERE earth_box(ll_to_earth($1, $2), $3 * 1000) @> ll_to_earth(latitude, longitude)
    AND earth_distance(ll_to_earth($1, $2), ll_to_earth(latitude, longitude)) < $3 * 1000;
  `;

  try {
    const result = await pool.query(query, [lat, lng, radius]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

app.listen(port, () => {
  console.log(`서버가 ${port}번 포트에서 실행 중입니다.`);
});
module.exports = router;
