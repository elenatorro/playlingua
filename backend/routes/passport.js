var LocalStrategy =       require('passport-local').Strategy
var LocalAPIKeyStrategy = require('passport-localapikey').Strategy
var config =              require('../../config/variables')

var FacebookStrategy =      require('passport-facebook').Strategy
var FACEBOOK_APP_ID =       config.passport.facebook.FACEBOOK_APP_ID
var FACEBOOK_APP_SECRET =   config.passport.facebook.FACEBOOK_APP_SECRET
var FACEBOOK_CALLBACK_URL = config.passport.facebook.FACEBOOK_CALLBACK_URL

var TwitterStrategy =         require('passport-twitter').Strategy
var TWITTER_CONSUMER_KEY =    config.passport.twitter.TWITTER_CONSUMER_KEY
var TWITTER_CONSUMER_SECRET = config.passport.twitter.TWITTER_CONSUMER_SECRET
var TWITTER_CALLBACK_URL =    config.passport.twitter.TWITTER_CALLBACK_URL

var GoogleStrategy =         require('passport-google-oauth').OAuth2Strategy
var GOOGLE_CONSUMER_KEY =    config.passport.google.GOOGLE_CONSUMER_KEY
var GOOGLE_CONSUMER_SECRET = config.passport.google.GOOGLE_CONSUMER_SECRET
var GOOGLE_CALLBACK_URL =    config.passport.google.GOOGLE_CALLBACK_URL

var User = require('../../app/models/user');
var Exercise = require('../../app/models/exercise');

module.exports = function (passport) {
  var serializeUser = function (user, done) {
    done(null, user.id)
  }

  var deserializeUser = function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user)
    })
  }

  var loginStrategy  = new LocalStrategy(config.passport.localStrategy, User.schema.methods.login)
  var signupStrategy = new LocalStrategy(config.passport.localStrategy, User.schema.methods.signup)
  var localapikey    = new LocalAPIKeyStrategy(User.schema.methods.api)

  var facebookStrategy = new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: FACEBOOK_CALLBACK_URL
  }, User.schema.methods.signup)

  var googleStrategy = new GoogleStrategy({
    clientID: GOOGLE_CONSUMER_KEY,
    clientSecret: GOOGLE_CONSUMER_SECRET,
    callbackURL: GOOGLE_CALLBACK_URL
  }, User.schema.methods.signup)

  var twitterStrategy = new TwitterStrategy({
    consumerKey: TWITTER_CONSUMER_KEY,
    consumerSecret: TWITTER_CONSUMER_SECRET,
    callbackURL: TWITTER_CALLBACK_URL
  }, User.schema.methods.signup)

  // Maintaining persistent login sessions
  passport.serializeUser(serializeUser)
  passport.deserializeUser(deserializeUser)

  // Strategies
  passport.use('login', loginStrategy)
  passport.use('signup', signupStrategy)
  passport.use('localapikey', localapikey)

  passport.use(facebookStrategy, User.signup)
  passport.use(googleStrategy, User.signup)
  passport.use(twitterStrategy, User.signup)
}
