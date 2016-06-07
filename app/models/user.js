var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var User = {};
var UserOperations = {};
var Exercise = require('../models/exercise');

const LEVELS = [{number: 1}, {number: 2}, {number: 3}];

var userSchema = mongoose.Schema({
    user             : {
  	  username     : String,
      email        : String,
      password     : String,
  	  name	       : String,
  	  address      : String,
      totalScore   : { type: Number, default: 0 },
      following    : [],
      followers    : []
    }
});

UserOperations.findUser = function (request, done) {
  User.findOne({ 'user.email' :  request.body.email }, function(err, user) {
    if (err)
      return done(err)
    if (!user)
      return done(null, false, 'error')
    if (!user.verifyPassword(request.body.password))
      return done(null, false, 'error')
    else
      return done(null, user)
  })
}

UserOperations.create = function (request, done) {
  var username, email, password, newUser, synonymsExercise, definitionsExercise, completeExercise;

  username = request.body.username;
  password = request.body.password;
  email =    request.body.email;

  newUser = new User();
  newUser.user.username =   username;
  newUser.user.email =      email;
  newUser.user.adress =     '';
  newUser.user.password =   newUser.generateHash(password);
  newUser.user.totalScore = 0;

  newUser.save(function(err) {
    if (err) {
      throw err
    }

    UserOperations.createExercise('sinonimos', username);
    UserOperations.createExercise('definiciones', username);
    UserOperations.createExercise('completar', username);

    return done(null, newUser);
  });
};

UserOperations.createExercise= function(name, username) {
  var exercise;

  exercise =          new Exercise();
  exercise.name =     name;
  exercise.title =    name;
  exercise.username = username;
  exercise.levels =   LEVELS;
  exercise.save();
}

UserOperations.findUserIfNoRequest = function (request, done) {
  User.findOne({ 'user.email' : request.body.email }, function (err, user) {
    if (err) {
      return done(err)
    }

    if (user) {
      return done(null, false, request.flash('signuperror', 'exists-user'));
    }

    else {
      UserOperations.create(request, done)
    }
  });
}

userSchema.methods.create = function(request, done) {
  UserOperations.findUserIfNoRequest(request, done);
}

userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.verifyPassword = function(password) {
    return bcrypt.compareSync(password, this.user.password);
};

userSchema.methods.updateUser = function(request, response){
	this.user.name = request.body.name;
	this.user.address = request.body.address;
	this.user.save();
	response.redirect('/user');
};

userSchema.methods.login = function (request, email, password, done) {
  process.nextTick(function () {
    UserOperations.findUser(request, done)
  })
}

userSchema.methods.signup = function (request, email, password, done) {
  process.nextTick(function () {
    UserOperations.findUserIfNoRequest(request, done)
  })
}

userSchema.methods.api = function (apikey, done) {
    User.findOne({ apikey: apikey }, function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      return done(null, user);
    });
}

User = mongoose.model('User', userSchema)
module.exports = User
