// local authentication
// For more details go to https://github.com/jaredhanson/passport-local
var LocalStrategy    = require('passport-local').Strategy;

// Facebook authentication
// For more details go to https://github.com/jaredhanson/passport-facebook
var FacebookStrategy = require('passport-facebook').Strategy;
var FACEBOOK_APP_ID = "353460018186588";
var FACEBOOK_APP_SECRET = "30b7175fdb7bbb445cd3cd4b198381c9";

// Twitter authentication
// For more details go to https://github.com/jaredhanson/passport-twitter
var TwitterStrategy = require('passport-twitter').Strategy;
var TWITTER_CONSUMER_KEY = "4BpKSr5FpwixL96vlreK6ANml";
var TWITTER_CONSUMER_SECRET = "4iJ8K1F3aP3wP4kScseVy7zojjZJ3oXXMIvfmHJXhBS6ClK9xg";

// Google authentication
// For more details go to https://github.com/jaredhanson/passport-google-oauth
var GOOGLE_CONSUMER_KEY = "864648951920-n80hr3gnob47kqu2cmada0cinrm7eair";
var GOOGLE_CONSUMER_SECRET = "wml2W1ELHmWtBS3dEDw-N645";
var GoogleStrategy   = require('passport-google-oauth').OAuth2Strategy

var User            = require('../app/models/user');
var Excercise       = require('../app/models/excercise');

var createUser = function(username, email, password, done) {
  var newUser            = new User();
  newUser.user.username  = username;
  newUser.user.email     = email;
  newUser.user.adress    = '';
  newUser.user.password  = newUser.generateHash(password);
  newUser.user.totalScore = 0;
  newUser.save(function(err) {
      if (err) {
        throw err
      } else {
        var synonyms = new Excercise();
        synonyms.name = 'sinonimos';
        synonyms.title = 'Sinónimos';
        synonyms.username = username;
        synonyms.levels = [{number:1},{number:2},{number:3}];
        synonyms.save();

        var definitions = new Excercise();
        definitions.name = 'definiciones';
        definitions.title = 'Definiciones';
        definitions.username = username;
        definitions.levels = [{number:1},{number:2},{number:3}];
        definitions.save();

        var complete = new Excercise();
        complete.name = 'completar';
        complete.title = 'Completar';
        complete.username = username;
        complete.levels = [{number:1},{number:2},{number:3}];
        complete.save();

        return done(null, newUser);
      }

  });
};

module.exports = function(passport) {

    // Maintaining persistent login sessions
    // serialized  authenticated user to the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // deserialized when subsequent requests are made
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

     passport.use('login', new LocalStrategy({
        usernameField : 'email',
        passReqToCallback : true
    },
    function(req, email, password, done) {
       process.nextTick(function() {
            User.findOne({ 'user.email' :  email }, function(err, user) {
                if (err){ return done(err);}
                if (!user)
                    return done(null, false, req.flash('error', '¡Ese usuario no existe!.'));

                if (!user.verifyPassword(password))
                    return done(null, false, req.flash('error', 'El usuario o la contraseña es incorrecto.'));
               else
                    return done(null, user);
            });
        });

    }));

     passport.use('signup', new LocalStrategy({
        usernameField : 'email',
        passReqToCallback : true
    },
    function(req, email, password, done) {

        process.nextTick(function() {
            if (!req.user) {
                User.findOne({ 'user.email' :  email }, function(err, user) {
            	    if (err){ return done(err);}
                    if (user) {
                        return done(null, false, req.flash('signuperror', '¡Ese usuario ya existe!'));
                    } else {
                        createUser(req.body.username, email, password, done);
                    }

                });
            } else {
                var user            = req.user;
		user.user.username    = req.body.username;
                user.user.email    = email;
                user.user.password = user.generateHash(password);
			user.user.name	= ''
			user.user.address	= ''

                user.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, user);
                });

            }

        });


    }));

// Use the FacebookStrategy within Passport.
// Strategies in Passport require a `verify` function, which accept
// credentials (in this case, an accessToken, refreshToken, and Facebook
// profile), and invoke a callback with a user object.
	passport.use(new FacebookStrategy({
    		clientID: FACEBOOK_APP_ID,
    		clientSecret: FACEBOOK_APP_SECRET,
    		callbackURL: "http://playlingua.herokuapp.com/auth/facebook/callback"
  		},
      function(req, accessToken, refreshToken, profile, done) {
      // asynchronous verification, for effect...

        process.nextTick(function () {
                if (!req.user) {
         User.findOne({ 'user.email' :  profile.emails[0].value }, function(err, user) {
                        if (err){ return done(err);}
                          if (user) {
                              return done(null, user);
                          } else {
                            var password = '';
                            createUser(profile.displayName, profile.emails[0].value, password, done);
                          }

                    });
                         } else {
        var user  = req.user;
        user.user.username    = profile.displayName;
                    user.user.email    = profile.emails[0].value;
        user.user.name	= ''
        user.user.address	= ''

                    user.save(function(err) {
                          if (err)
                              throw err;
                        return done(null, user);
                    });
                }
        });
    }
	));

// Use the TwitterStrategy within Passport.
// Strategies in passport require a `verify` function, which accept
// credentials (in this case, a token, tokenSecret, and Twitter profile), and
// invoke a callback with a user object.
			passport.use(new TwitterStrategy({
    			consumerKey: TWITTER_CONSUMER_KEY,
    			consumerSecret: TWITTER_CONSUMER_SECRET,
    			callbackURL: "http://playlingua.herokuapp.com/auth/twitter/callback"
  		},
  		function(req,token, tokenSecret, profile, done) {
    // asynchronous verification, for effect...
    			process.nextTick(function () {

     				 if (!req.user) {
 					User.findOne({ 'user.username' :  profile.displayName }, function(err, user) {
            	    				if (err){ return done(err);}
                    				if (user) {
                        				return done(null, user);
                    				} else {
                              var password = '';
                              var email = '';
                              createUser(profile.displayName, email, password, done);
                    				}

                			});
                         	} else {
					var user            = req.user;
					user.user.username    = profile.displayName;
					user.user.name	= ''
					user.user.address	= ''

                			user.save(function(err) {
                    				if (err)
                        				throw err;
                    			return done(null, user);
                			});
            			}
    			});
  		}
	));

// Use the GoogleStrategy within Passport.
// Strategies in Passport require a `verify` function, which accept
// credentials (in this case, an accessToken, refreshToken, and Google
// profile), and invoke a callback with a user object.
		passport.use(new GoogleStrategy({
    				clientID: GOOGLE_CONSUMER_KEY,
    				clientSecret: GOOGLE_CONSUMER_SECRET,
    				callbackURL: "http://playlingua.herokuapp.com/auth/google/callback"
  				},
  				function(req, accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    					process.nextTick(function () {

     						if (!req.user) {
 							User.findOne({ 'user.email' :  profile.emails[0].value }, function(err, user) {
            	    						if (err){ return done(err);}
                    					if (user) {
                        					return done(null, user);
                    					} else {
                                var password = '';
                                createUser(profile.displayName, profile.emails[0].value, password, done);
                    					}

                					});
                         			} else {
							var user            = req.user;
							user.user.username    = profile.displayName;
							user.user.email    = profile.emails[0].value;
                					user.save(function(err) {
                    					if (err)
                        					throw err;
                    					return done(null, user);
							});
						}
                			});

    			}

));
};
