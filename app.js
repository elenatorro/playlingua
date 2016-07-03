
const
	VARIABLES =     require('./config/variables.js'),
	VIEWS_PATH =    'views',
	VIEWS_OPTIONS = 'views options',
	ENGINE =        'html';

var
	express =         require('express'),
 app =             express(),
	mongoose =        require('mongoose'),
	passport =        require('passport'),
	flash =           require('connect-flash'),
	path =            require('path'),
	fs =              require('fs'),
	http =            require('http'),
	server =          http.createServer(app),
	configDatabase =  require('./config/database.js'),
	port =            process.env.PORT || VARIABLES.development.port;

mongoose.connect(process.env.MONGOLAB_URI || configDatabase.url);

require('./backend/routes/passport')(passport);

app.configure(function() {
    app.use(express.cookieParser());
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(express.static(path.join(__dirname, VARIABLES.production.path)));

    app.set(VIEWS_PATH, __dirname + VARIABLES.production.views);
    app.set(VIEWS_OPTIONS, {layout: false});
    app.engine(ENGINE, require('ejs').renderFile);
				
    app.use(express.session({secret: VARIABLES.secret}));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(flash());
});

require('./backend/routes/_routes.js')(app, passport, server);

server.listen(port);

console.log('Listening  to  port http://localhost:' + port);
