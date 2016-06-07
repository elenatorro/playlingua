function auth(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
};

module.exports = function (app, passport, server) {

  require('../routes/main.js')(app, auth, passport, server);
  require('../routes/user.js')(app, auth, passport, server);
  require('../routes/exercise.js')(app, auth, passport, server);

  var io = require('socket.io').listen(server);

  var usernames = {};

  io.sockets.on('connection', function (socket) {
    socket.on('adduser', function(username) {
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
