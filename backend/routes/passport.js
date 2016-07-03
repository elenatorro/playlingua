var
    config =              require('../../config/variables'),
    LocalStrategy =       require('passport-local').Strategy,
    LocalAPIKeyStrategy = require('passport-localapikey').Strategy,
    FacebookStrategy =    require('passport-facebook').Strategy,
    TwitterStrategy =     require('passport-twitter').Strategy,
    GoogleStrategy =      require('passport-google-oauth').OAuth2Strategy,

    facebookStrategySecrets = {
        clientID:     config.passport.facebook.FACEBOOK_APP_ID,
        clientSecret: config.passport.facebook.FACEBOOK_APP_SECRET,
        callbackURL:  config.passport.facebook.FACEBOOK_CALLBACK_URL
    }

    googleStragegySecrets = {
        clientID:     config.passport.google.GOOGLE_CONSUMER_KEY,
        clientSecret: config.passport.google.GOOGLE_CONSUMER_SECRET,
        callbackURL:  config.passport.google.GOOGLE_CALLBACK_URL
    }

    twitterStrategySecrets = {
        consumerKey:    config.passport.twitter.TWITTER_CONSUMER_KEY,
        consumerSecret: config.passport.twitter.TWITTER_CONSUMER_SECRET,
        callbackURL:    config.passport.twitter.TWITTER_CALLBACK_URL
    }

    User =     require('../../app/models/user'),
    Exercise = require('../../app/models/exercise');

module.exports = function(passport) {
 var serializeUser, deserializeUser, loginStrategy, signupStrategy, localapikey, facebookStrategy, googleStrategy, twitterStrategy;

 loginStrategy =    new LocalStrategy(config.passport.localStrategy, User.schema.methods.login)
 signupStrategy =   new LocalStrategy(config.passport.localStrategy, User.schema.methods.signup)
 localapikey =      new LocalAPIKeyStrategy(User.schema.methods.api)
 facebookStrategy = new FacebookStrategy(facebookStrategySecrets, User.schema.methods.signup)
 twitterStrategy =  new TwitterStrategy(twitterStrategySecrets, User.schema.methods.signup)
 googleStrategy =   new GoogleStrategy(googleStrategySecrets, User.schema.methods.signup)

 passport.use('login', loginStrategy)
 passport.use('signup', signupStrategy)
 passport.use('localapikey', localapikey)

 passport.use(facebookStrategy, User.signup)
 passport.use(googleStrategy, User.signup)
 passport.use(twitterStrategy, User.signup)

 serializeUser = function serializeUser(user, done) {
   done(null, user.id)
 }

 deserializeUser = function deserializeUser(id, done) {
   User.findById(id, function(err, user) {
    done(err, user)
   })
 }

  passport.serializeUser(serializeUser)
  passport.deserializeUser(deserializeUser)
}
