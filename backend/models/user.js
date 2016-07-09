var
  mongoose = require('mongoose'),
  bcrypt = require('bcrypt-nodejs'),
  Exercise = require('../models/exercise'),
  Models = require('../constants/Models'),
  User = {},
  UserOperations = {};

const
  LEVELS = require('../constants/levels'),
  EXERCISES = require('../constants/exercises'),
  RequestErrors = require('../constants/request-errors');

var userSchema = mongoose.Schema({
  username: String,
  email: String,
  password: String,
  name: String,
  address: String,
  following: [],
  followers: [],
  totalScore: {
    type: Number,
    default: 0
  }
});

UserOperations.create = function (request, done) {
  var username, email, password, newUser, synonymsExercise, definitionsExercise, completeExercise;

  username = request.body.username;
  password = request.body.password;
  email = request.body.email;

  newUser = new User();

  newUser.username = username;
  newUser.email = email;
  newUser.password = newUser.generateHash(password);
  newUser.totalScore = 0;

  newUser.save(function (err) {
    if(err) {
      throw err
    }

    _createUserDefaultExercises(username);

    return done(null, newUser);
  });
};

userSchema.methods.create = function (request, done) {
  _findUserIfNoRequest(request, done);
}

userSchema.methods.generateHash = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.verifyPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

userSchema.methods.updateUser = function (request, response) {
  this.name = request.body.name;
  this.address = request.body.address;
  this.save();
};

userSchema.methods.login = function (request, email, password, done) {
  process.nextTick(function () {
    _findUser(request, done)
  })
}

userSchema.methods.signup = function (request, email, password, done) {
  process.nextTick(function () {
    _findUserIfNoRequest(request, done)
  })
}

userSchema.methods.api = function (apikey, done) {
  User.findOne({
    apikey: apikey
  }, function (err, user) {
    if(err) {
      return done(err);
    }
    if(!user) {
      return done(null, false);
    }
    return done(null, user);
  });
}

User = mongoose.model(Models.USER, userSchema)
module.exports = User

/* Private */

function _findUser(request, done) {
  User.findOne({
    email: request.body.email
  }, function (err, user) {
    if(err)
      return done(err)
    if(!user)
      return done(null, false, 'error')
    if(!user.verifyPassword(request.body.password))
      return done(null, false, 'error')
    else
      return done(null, user)
  })
}

function _findUserIfNoRequest(request, done) {
  User.findOne({
    email: request.body.email
  }, function (err, user) {

    if(err) {
      return done(err)
    }

    return user ?
      done(null, false, request.flash(RequestErrors.SIGNUP, RequestErrors.EXISTS_USER)) :
      UserOperations.create(request, done)
  });
}

function _createExercise(name, username) {
  var exercise;

  exercise = new Exercise();
  exercise.name = name;
  exercise.title = name;
  exercise.username = username;
  exercise.levels = LEVELS;
  exercise.save();
}

function _createUserDefaultExercises(username) {
  EXERCISES.forEach(function (exercise) {
    _createExercise(exercise, username);
  });
}
