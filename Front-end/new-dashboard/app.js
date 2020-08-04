const dotenv = require("dotenv");
dotenv.config();

var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var queriesRounter = require("./routes/queries");
var tweetsRouter = require("./routes/tweets");

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "build")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/tweets", tweetsRouter);
app.use("/queries", queriesRounter);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/build/index.html"));
});

module.exports = app;
