module.exports = function(app, auth, passport, server) {
    app.get('/', function(request, response) {
      response.render('index.html');
    });

    app.get('/dashboard/*', auth, function(request, response) {
      response.render('main.html');
    });

    app.get('/logout', auth, function(request, response) {
      request.logout();
      response.redirect('/');
    });

    app.get('/login', function(request, response) {
      if (request.isAuthenticated()) {
        response.redirect('/dashboard/user');
      }
      response.render('login.html', {
          message: request.flash('error')
      });
    });

    app.post('/login', passport.authenticate('login', {
      successRedirect: '/dashboard/user',
      failureRedirect: '/login',
      failureFlash: true
    }));

    app.get('/signup', function(request, response) {
      response.render('signup.html', {
        message: request.flash('signuperror')
      });
    });

    app.post('/signup', passport.authenticate('signup', {
      successRedirect: '/dashboard/user',
      failureRedirect: '/signup',
      failureFlash: true
    }));

    app.get('/edit', function(request, response) {
      response.render('edit.html', {
          message: request.flash('updateerror')
      });
    });


    app.post('/edit', function(req, res) {
      var tempPath, targetPath;
      tempPath = req.files.file.path,
      targetPath = path.resolve('./uploads/' + req.files.file.originalFilename);
      if (path.extname(req.files.file.name).toLowerCase() === '.png') {
        fs.rename(tempPath, './uploads/image_' + req.user._id, function(err) {
            if (err) throw err;
        });
      }

      User.findOne({'user.email': req.body.email}, function(err, user) {
        if (err) {
            return done(err);
        }
        user.updateUser(req, res);
      });
  });
}
