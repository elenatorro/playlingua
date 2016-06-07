var User = require('../../app/models/user');

module.exports = function(app, auth, passport, server) {
  app.get('/user', auth, function(request, response) {
    response.setHeader('Content-Type', 'application/json');
    response.end(JSON.stringify({
      username:   request.user.user.username,
      totalScore: request.user.user.totalScore,
      user:       request.user.user.followers,
      following: request.user.user.following
    }));
  });

  app.get('/userdata/:username', auth, function(request, response) {
    var query, user;

    query = Exercise.find({username: request.params.username}, {'_id': 0});
    query.select('name levels');
    query.exec(function(err, userdata) {
      if (!err) {
       if (userdata.length!=0) {
         user = {
           username: request.params.username,
           exercises: userdata
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
  });

  app.put('/unfollow/:username', auth, function(request, response) {
    var response = {'message': ''};
    var follow = User.find({'user.username': request.params.username}, {'_id': 0});
    follow.select('user.username user.followers user.following');
    follow.exec(function(err, user) {
      if (!err) {
        var userdata = user[0];
        var updateFollowers = User.update({'user.username': userdata.user.username},{'$pull': {'user.followers': request.user.user.username}});
        updateFollowers.exec(function(err, data) {
          if(!err) {
            var updateFollowing = User.update({'user.username': request.user.user.username}, {'$pull': {'user.following': userdata.user.username}});
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
  });

  app.get('/image.png', function (req, res) {
        res.sendfile(path.resolve('./uploads/image_'+req.user._id));
  });
}
