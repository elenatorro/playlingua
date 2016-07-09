const RequestErrors = require('../constants/request-errors');

module.exports = function (app, auth, passport, server) {
  app.get('/', function (request, response) {
    response.render('index.html');
  });

  app.get('/dashboard/*', auth, function (request, response) {
    response.render('main.html');
  });

  app.get('/logout', auth, function (request, response) {
    request.logout();
    response.redirect('/');
  });

  app.get('/login', function (request, response) {
    if(request.isAuthenticated()) {
      response.redirect('/dashboard/user');
    }
    response.render('login.html', {
      message: request.flash(RequestErrors.ERROR)
    });
  });

  app.post('/login', passport.authenticate('login', {
    successRedirect: '/dashboard/user',
    failureRedirect: '/login',
    failureFlash: true
  }));

  app.get('/signup', function (request, response) {
    response.render('signup.html', {
      message: request.flash(RequestErrors.SIGNUP)
    });
  });

  app.post('/signup', passport.authenticate('signup', {
    successRedirect: '/dashboard/user',
    failureRedirect: '/signup',
    failureFlash: true
  }));

  app.get('/edit', function (request, response) {
    response.render('edit.html', {
      message: request.flash(RequestErrors.UPDATE)
    });
  });
}
