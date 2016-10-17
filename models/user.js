var bcrypt = require("bcrypt-nodejs");
var mongoose = require("mongoose");
var beautifyUnique = require('mongoose-beautiful-unique-validation');

var SALT_FACTOR = 10;

var userSchema = mongoose.Schema({
  username: { type: String, required: true, unique: 'This username is already taken. Please choose another one.', trim: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  bio: String,
  age: Number,
  email: { type: String, unique: 'This email is already taken. Please enter another.' },
});

var noop = function() {};

userSchema.pre("save", function(done) {
  var user = this;

  if (!user.isModified("password")) {
    return done();
  }

  bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
    if (err) { return done(err); }
    bcrypt.hash(user.password, salt, noop, function(err, hashedPassword) {
      if (err) { return done(err); }
      user.password = hashedPassword;
      done();
    });
  });
});

userSchema.methods.checkPassword = function(guess, done) {
  bcrypt.compare(guess, this.password, function(err, isMatch) {
    done(err, isMatch);
  });
};

userSchema.plugin(beautifyUnique);

var User = mongoose.model('User', userSchema);

module.exports = User;
