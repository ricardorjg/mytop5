var express = require('express');
var bodyParser = require("body-parser");
var passport = require("passport");
var session = require("express-session");
var flash = require('connect-flash');
var path = require('path');

var app = express();
require('./conf/db');

app.listen(3000, function (req) {
  console.log('app listening through port 3000');
});

var userRoutes = require('./routes/userRoutes');
var generalRoutes = require('./routes/generalRoutes');
var passportConf = require('./conf/passportConf');

passportConf();

app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
  secret: "LUp$Dg?,I#i&owP3=9su+OB%`JgL4muLF5YJ~{;t",
  resave: true,
  saveUninitialized: true
}));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.errors = req.flash("error");
  res.locals.infos = req.flash("info");
  next();
});

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static('public'));

app.use(generalRoutes);
app.use('/user', userRoutes);
