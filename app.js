var express  = require('express');
var app      = express();


var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');
var path     = require('path');
var fs       = require('fs');
var http     = require('http');
var server   = http.createServer(app);

var configDatabase = require('./config/database.js');
var VARIABLES = require('./config/variables.js');
var port = process.env.PORT || VARIABLES.development.port;

mongoose.connect(process.env.MONGOLAB_URI || configDatabase.url);

require('./backend/routes/passport')(passport);

app.configure(function() {
	app.use(express.cookieParser());
	app.use(express.json());
  app.use(express.urlencoded());
	app.use(express.static(path.join(__dirname, VARIABLES.production.path)));
	app.set('views', __dirname + VARIABLES.production.views);
	app.set('view options', {layout: false});
	app.engine('html', require('ejs').renderFile);
	app.use(express.session({ secret:  VARIABLES.secret}));
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(flash());
});

require('./backend/routes/_routes.js')(app, passport, server);

server.listen(port);
console.log('Listening  to  port http://localhost:' + port);
