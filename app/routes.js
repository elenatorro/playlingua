var User       = require('../app/models/user');
var Friend     = require('../app/models/friend');
var Text       = require('../app/models/text');
var Excercise  = require('../app/models/excercise');

   async = require("async");
var path = require('path'),
      fs = require('fs');

module.exports = function(app, passport,server) {
	app.get('/', function(request, response) {
		response.render('index.html');
	});

	app.get('/user', auth, function(request, response) {
    response.setHeader('Content-Type', 'application/json');
    response.end(JSON.stringify({username: request.user.user.username,
                                 totalScore: request.user.user.totalScore,
                                 user: request.user.user.followers,
                                 following: request.user.user.following}));
	});

  app.get('/dashboard/*', auth, function(request, response) {
    response.render('main.html');
	});

  app.get('/excercises/:username?', auth, function(request, response) {
    var username = request.params.username;
    if (!username) username = request.user.user.username;
    var query = Excercise.find({username: username});
    query.exec(function(err, excercises) {
      if (err) {
        response.end(JSON.stringify(err));
      } else {
        response.setHeader('Content-Type', 'application/json;  charset=utf-8');
        response.end(JSON.stringify(excercises));
      }
    });
  });

  app.get('/userdata/:username', auth, function(request, response) {
    var query = Excercise.find({username: request.params.username}, {'_id': 0});
    query.select('name levels');
    query.exec(function(err, userdata) {
        if (!err) {
           if (userdata.length!=0) {
             var user = {
               username: request.params.username,
               excercises: userdata
             };
             response.send(JSON.stringify(user), {
                  'Content-Type': 'application/json'
             }, 200);
           } else {
             response.send(JSON.stringify({'message': 'no-user'}), {
                  'Content-Type': 'application/json'
             }, 404);
           }

        } else {
           response.send(JSON.stringify(err), {
                'Content-Type': 'application/json'
           }, 404);
        }
     });
  });

  app.put('/follow/:username', auth, function(request, response) {
    var response = {'message': ''};
    var follow = User.find({'user.username': request.params.username}, {'_id': 0});
    follow.select('user.username user.followers user.following');
    follow.exec(function(err, user) {
      if (!err) {
        var userdata = user[0];
        var updateFollowers = User.update({'user.username': userdata.user.username},{'$addToSet': {'user.followers': request.user.user.username}});
        updateFollowers.exec(function(err, data) {
          if(!err) {
            var updateFollowing = User.update({'user.username': request.user.user.username}, {'$addToSet': {'user.following': userdata.user.username}});
            updateFollowing.exec(function(err, data) {
              if (!err) {
                response.message = 'OK';
              } else {
                response = err;
              }
            })
          } else {
            response = err;
          }
        })
      } else {
        response = err;
      }
    })
  })

  app.get('/:name/level/:levelnumber', function(request, response) {
    var query = Text.find({name: request.params.name, level: request.params.levelnumber});
    query.exec(function(err, texts) {
      response.setHeader('Content-Type', 'application/json;  charset=utf-8');
      var game = {
        excercises: texts,
        levelNumber: request.params.levelnumber,
      };
      response.end(JSON.stringify(game));
    });
  });

  app.put('/save/:name/:levelnumber/:score', auth, function(request, response) {
    var userData = request.user;
    var levelNumber = parseInt(request.params.levelnumber) - 1;
    var score = parseInt(request.params.score);
    var name = request.params.name;
    var totalScore = parseInt(userData.user.totalScore) + parseInt(score);
    var maxScore, timesPlayed, lastScore, levelField, excerciseScore;
    var query = User.update({'user.username': userData.user.username},{$set:{'user.totalScore': totalScore}});
    Excercise.find({'name': name, 'username': userData.user.username}, function(err, excercise) {
      if (excercise[0].levels[levelNumber]) {
        maxScore = Math.max(excercise[0].levels[levelNumber].maxScore, score);
        timesPlayed = excercise[0].levels[levelNumber].timesPlayed;
        number = excercise[0].levels[levelNumber].number;
        lastScore = score;
        excerciseScore = excercise[0].levels[levelNumber].totalScore + score;

      } else {
        maxScore = score;
        timesPlayed = 0;
        lastScore = score;
        number = levelNumber + 1;
        excerciseScore = score;
      }

      levelField = 'levels.' + (levelNumber).toString();
      timesPlayed++;

      var excerciseData = {
        name: name,
        username: userData.user.username
      };

      var excerciseUpdate = {$set: {}};
      excerciseUpdate['$set'][levelField] = {
            maxScore: maxScore,
            timesPlayed: timesPlayed,
            number: number,
            lastScore: lastScore,
            totalScore: excerciseScore
          };

      Excercise.update(excerciseData, excerciseUpdate, function(err, data) {
          if (err) {
            response.setHeader('Content-Type', 'application/json;  charset=utf-8');
            response.end(JSON.stringify(err));
          } else {
            query.exec(function(err, data) {
              if (err) {
                response.setHeader('Content-Type', 'application/json;  charset=utf-8');
                response.end(JSON.stringify(err));
              } else {
                response.setHeader('Content-Type', 'application/json;  charset=utf-8');
                response.end(JSON.stringify(data));
              };
            });
          };
      })
    });

  });

	app.get('/image.png', function (req, res) {
    		res.sendfile(path.resolve('./uploads/image_'+req.user._id));
	});

	app.get('/edit', auth, function(request, response) {
		response.render('edit.html', {
			user : request.user
		});
	});

	app.get('/logout', auth, function(request, response) {
		request.logout();
		response.redirect('/');
	});

		app.get('/login', function(request, response) {
      if (request.isAuthenticated()) { response.redirect('/dashboard/user'); }
			response.render('login.html', { message: request.flash('error') });
		});

		app.post('/login', passport.authenticate('login', {
			successRedirect : '/dashboard/user',
			failureRedirect : '/login',
			failureFlash : true
		}));

		app.get('/signup', function(request, response) {
			response.render('signup.html', { message: request.flash('signuperror') });
		});


		app.post('/signup', passport.authenticate('signup', {
			successRedirect : '/dashboard/user',
			failureRedirect : '/signup',
			failureFlash : true
		}));

		app.get('/edit', function(request, response) {
			response.render('edit.html', { message: request.flash('updateerror') });
		});


		app.post('/edit',  function (req, res){
				 var tempPath = req.files.file.path,
        			targetPath = path.resolve('./uploads/'+req.files.file.originalFilename);
    				if (path.extname(req.files.file.name).toLowerCase() === '.png') {
        				fs.rename(tempPath, './uploads/image_'+req.user._id, function(err) {
            					if (err) throw err;
            				console.log("Upload completed!");
        				});
    				}
 			 User.findOne({ 'user.email' :  req.body.email }, function(err, user) {
                		if (err){ return done(err);}
                		if (user)
                    			user.updateUser(req, res)
                         });
  		});

		app.get('/profile', auth, function(request, response) {
			var query = Friend.find({'friend.mainfriendid': request.user._id}, { 'friend.anotherfriendid': 1 });
			query.exec(function(err, friends) {

      		if (!err) {
		var frdDetails = []

		async.each(friends,
    			function(friend, callback){
				if(friend.friend.anotherfriendid == ''){
			console.log('No Friend')
				}else{
    					User.findById(friend.friend.anotherfriendid, function(err, user) {
						frdDetails.push(user.user.name+', '+user.user.address);
 						callback();
					});
   				}
  			},
  			function(err){
         			response.render('profile.html', {
					user : request.user,
					friends: frdDetails
				});
  			}
		);
       		} else {
         		res.send(JSON.stringify(err), {
            			'Content-Type': 'application/json'
         		}, 404);
      		}
   		});

	});

  app.get('/searchuser/:username', function(req, res) {
      var query = User.find({ $and: [ {'user.username': req.params.username}, { _id: { $ne: req.user._id } } ] }, {'_id': 0} ).limit(20);
      query.select('user.username');
      query.exec(function(err, users) {
          if (!err) {
             res.send(users, {
                  'Content-Type': 'application/json'
             }, 200);
          } else {
             res.send(JSON.stringify(err), {
                  'Content-Type': 'application/json'
             }, 404);
          }
       });
  });

		app.post('/friend',  function (request, response){
				Friend.findOne({ $and: [ {'friend.mainfriendid': request.param('mainfriendid')}, { 'friend.anotherfriendid': request.param('anotherfriendid') } ] }, function(err, friend) {
            	    		if (err){ return done(err);}
                    		if (friend) {
				response.redirect('/profile');

                    		} else {
				if(request.param('anotherfriendid') != ''){
				var newFriend            = new Friend();
 			 	newFriend.friend.mainfriendid = request.param('mainfriendid');
				newFriend.friend.anotherfriendid = request.param('anotherfriendid');
	 			newFriend.save();
				}
				response.redirect('/profile');
				}
 				});
  		});



// GET /auth/facebook
// Use passport.authenticate() as route middleware to authenticate the
// request. The first step in Facebook authentication will involve
// redirecting the user to facebook.com. After authorization, Facebook will
// redirect the user back to this application at /auth/facebook/callback
		app.get('/auth/facebook',
  			passport.authenticate('facebook',{ scope : 'email' }));

// GET /auth/facebook/callback
// Use passport.authenticate() as route middleware to authenticate the
// request. If authentication fails, the user will be redirected back to the
// login page. Otherwise, the primary route function function will be called,
// which, in this example, will redirect the user to the home page.
		app.get('/auth/facebook/callback',
  			passport.authenticate('facebook', {
				successRedirect : '/dashboard/user',
				failureRedirect: '/login' }));





// GET /auth/twitter
// Use passport.authenticate() as route middleware to authenticate the
// request. The first step in Twitter authentication will involve redirecting
// the user to twitter.com. After authorization, the Twitter will redirect
// the user back to this application at /auth/twitter/callback
app.get('/auth/twitter',
  passport.authenticate('twitter'));

// GET /auth/twitter/callback
// Use passport.authenticate() as route middleware to authenticate the
// request. If authentication fails, the user will be redirected back to the
// login page. Otherwise, the primary route function function will be called,
// which, in this example, will redirect the user to the home page.
app.get('/auth/twitter/callback',
  passport.authenticate('twitter', {
				successRedirect : '/dashboard/user',
				failureRedirect: '/login' }));


// GET /auth/google
// Use passport.authenticate() as route middleware to authenticate the
// request. The first step in Google authentication will involve
// redirecting the user to google.com. After authorization, Google
// will redirect the user back to this application at /auth/google/callback
app.get('/auth/google',
  passport.authenticate('google', { scope : ['profile', 'email'] }));

// GET /auth/google/callback
// Use passport.authenticate() as route middleware to authenticate the
// request. If authentication fails, the user will be redirected back to the
// login page. Otherwise, the primary route function function will be called,
// which, in this example, will redirect the user to the home page.
app.get('/auth/google/callback',
  passport.authenticate('google', {
				successRedirect : '/dashboard/user',
				failureRedirect: '/login' }));


var io = require('socket.io').listen(server);

var usernames = {};

io.sockets.on('connection', function (socket) {

  socket.on('adduser', function(username){
    socket.username = username;
    usernames[username] = username;
    io.sockets.emit('updateusers', usernames);
  });

  socket.on('disconnect', function(){
    delete usernames[socket.username];
    io.sockets.emit('updateusers', usernames);
    socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');
  });
});
};

function auth(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
};
