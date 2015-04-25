var express  = require('express');
var app      = express();

var port     = process.env.PORT || 1057;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');
var path     = require('path');
var fs       = require('fs');
var http     = require('http');
var server   = http.createServer(app)


var configDB = require('./config/database.js');

mongoose.connect(process.env.MONGOLAB_URI || configDB.url);

require('./config/passport')(passport);

app.configure(function() {
	app.use(express.cookieParser());
	app.use(express.json());
  app.use(express.urlencoded());
	app.use(express.static(path.join(__dirname, 'public')));
	app.set('views', __dirname + '/public/views');
	app.set('view options', {layout: false});
	app.engine('html', require('ejs').renderFile);
	app.use(express.session({ secret: 'knoldus' }));
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(flash());
});

require('./app/routes.js')(app, passport,server);

server.listen(port);
console.log('Listening  to  port http://localhost:' + port);
