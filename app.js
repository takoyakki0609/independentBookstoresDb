require("dotenv").config();

var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");

var app = express();

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var independentBookstoreRouter = require(path.join(
  __dirname,
  "routes",
  "independentBookstoreRoutes"
));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://book-er.site/",
      "https://book-stores-a868c1b5c0ae.herokuapp.com/",
    ],
  })
);
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/bookstores", independentBookstoreRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

app.get("/", function (req, res) {
  res.send("Welcome to my web app");
});

module.exports = app;
