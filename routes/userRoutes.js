var express = require('express');
var passport = require('passport');
var User = require("../models/user");

var router = express.Router();

router.get('/signup', function (req, res) {
  res.send('signup route enabled!');
});

router.post('/signup', function (req, res, next) {

  if (!req.body.username || !req.body.password) {
    //Display and error: Both username and password are required
    req.flash('info', 'the username and password fields are required.');
    return res.redirect('/user/signup');
  }

  User.findOne({ 'username': req.body.username })
      .then(function (user) {
        if (user) {
          //Display an error: The username is already taken.
          req.flash('info', 'The username is already taken please choose another.');
          return res.redirect('/user/signup');
        }

        var newUser = new User();
        newUser.username = req.body.username;
        newUser.password = req.body.password;
        newUser.save(next);
      })
      .catch(function (error) {
        return next(error);
      });
}, passport.authenticate('login', {
  successRedirect: "/",
  failureRedirect: "/user/signup",
  failureFlash: true
}));

router.get('/login', function (req, res) {
  res.render('login');
});

router.post('/login', function (req, res, next) {
  next();
}, passport.authenticate("login", {
  successRedirect: "/",
  failureRedirect: "/user/login",
  failureFlash: true
}));

router.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/");
});

module.exports = router;
