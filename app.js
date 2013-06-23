
/**
 * InterestBoard
 * --------------------
 * A collaborative realtime board.
 */

var connect 		= require('connect')
  ,	express 		= require('express')
  , MongoStore 	= require('express-session-mongo')
  , gridfs 			= require('gridfs-stream')
  , everyauth 	= require('everyauth-express3')
  ,	io 					= require('socket.io')
  , http 				= require('http')
  , path 				= require('path')
  , stylus 			= require('stylus')
  , nib 				= require('nib')
  , fs 					= require('fs')
  , events 			= require('events')
  , mongoose 		= require('mongoose')
  ,	i18n 				= require("i18n")
  , Log 				= require('log')
  , apachelog 	= require('apache-like-accesslog');
  ;

// Set the global configuration
var	apiconf = require('./configure');

/** 
 * Default environment is development. Run this application on productive environments 
 * with ENV=production
 */  
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

/**
 * Set the logger.
 */
if(! apiconf.log.level || apiconf.log.level == ""){
	apiconf.log.level = "info";
}
// Alwasy log everything in debug mode.
if ('development' == process.env.NODE_ENV) {
	apiconf.log.level = "debug"; 
}
if(! apiconf.log.file || apiconf.log.file == ""){
	apiconf.log.file = "application.log";
}
var log = new Log(''+ apiconf.log.level , fs.createWriteStream(''+ apiconf.log.file));

// enable debug mode in development mode
if ('development' == process.env.NODE_ENV) {
	// turn on debug mode on everyauth and mongoose
	everyauth.debug = true;
	mongoose.set('debug', true);
	
	// log even to stdout
	log.on('line', function(line){
		console.log(line);
	});
}

// MONGO CONNECT
// After all Mongoose handels the models.
var conn = mongoose.createConnection("mongodb://localhost/InterestBoard", {
	server: { poolSize: 4 }
});

conn.on('error', function () {
  log.error('Error! Database connection failed.');
});	

conn.once('open', function () {
	if ('development' == process.env.NODE_ENV) log.info("Opening MongoDB and GridFS");
	var gfs = gridfs(conn.db, mongoose.mongo);
	app.gridfs = gfs;
});

// Users 
var usersById = {};
var usersByFbId = {};
var usersByLogin = {};
var nextUserId = 0;
function addUser (source, sourceUser) {
	var user;
	if (arguments.length === 1) { // password-based
		user = sourceUser = source;
		user.id = ++nextUserId;
		return usersById[nextUserId] = user;
	} else { // non-password-based
		user = usersById[++nextUserId] = {id: nextUserId};
		user[source] = sourceUser;
	}
	return user;
}

everyauth.everymodule
	.findUserById( function (id, callback) {
	callback(null, usersById[id]);
});

everyauth
	.facebook
	.appId(apiconf.fb.appId)
	.appSecret(apiconf.fb.appSecret)
	.findOrCreateUser( function (session, accessToken, accessTokenExtra, fbUserMetadata) {
	log.info("Facebook user %s with id %s logged in.", fbUserMetadata.name, fbUserMetadata.id);
	return usersByFbId[fbUserMetadata.id] ||
			(usersByFbId[fbUserMetadata.id] = addUser('facebook', fbUserMetadata));
	})
	.redirectPath('/')
	.fields('id, name, email, picture, link, username, about, hometown, location, bio, quotes, gender')
	;

everyauth
  .password
    .loginWith('email')
    .getLoginPath('/login')
    .postLoginPath('/login')
    .loginView('login.jade')
    .loginLocals({
      title: 'Login'
    })
    .loginLocals(function (req, res) {
      return {
        title: 'Login'
      }
    })
    .authenticate( function (login, password) {
      var errors = [];
      if (!login) errors.push('Missing login');
      if (!password) errors.push('Missing password');
      if (errors.length) return errors;
      var user = usersByLogin[login];
      if (!user){
      	if('development' == app.get('env')){
      		// testuser should allways pass.
      		user = { id: '-1',
				name: 'Local Testuser',
				link: 'http://www.example.com',
				username: 'local.testuser',
				hometown: { id: '-1', name: '' },
				gender: 'neutrum',
				picture: { 
					data: { 
						url: 'http://noimage.com/image.jpg',
						is_silhouette: true 
					} 
				} 
			};
			log.info("A dummy user is logged in.");
			return usersByLogin[user.id] ||
				(usersById[user.id] = addUser('passport', user));
      	} else {
	      	return ['Login failed'];
      	}
      } 
      if (user.password !== password) return ['Login failed'];
      return user;
    })
    .getRegisterPath('/register')
    .postRegisterPath('/register')
    .registerView('register.jade')
    .registerLocals({
      title: 'Register'
    })
    .registerLocals(function (req, res) {
      return {
        title: 'Sync Register'
       }
    })
    .validateRegistration( function (newUserAttrs, errors) {
      var login = newUserAttrs.login;
      if (usersByLogin[login]) errors.push('Login already taken');
      return errors;
    })
    .registerUser( function (newUserAttrs) {
      var login = newUserAttrs[this.loginKey()];
      return usersByLogin[login] = addUser(newUserAttrs);
    })
    .loginSuccessRedirect('/')
    .registerSuccessRedirect('/');

// Languages
i18n.configure({
    locales:['en', 'de'],
    defaultLocale: 'en',
    directory: './locales',
    updateFiles: true,
    extension: '.json'
});

// Create an http server
var app = express();
app.server = http.createServer(app);

// register global
app.i18n = i18n;
app.log = log;
// register a global eventemitter
app.eventEmitter = new events.EventEmitter();
// registrer the database connection 
app.dbconnection = conn;
// set locales
apiconf.setLocales(app);
app.configure = apiconf;

// Stylus compiler
function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .use(nib())
}

// Import the models
var models = {
	Board: require('./models/Board')(app, mongoose)
};

app.sessionSecret = 'foo';
app.sessionStore = new MongoStore({
	"db": "InterestBoard",
//	"ip": "127.0.0.1",
//	"port": "27017",
	"collection": "sessions"
	});


// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.cookieParser('htuayreve'));
app.use(express.methodOverride());
app.use(express.session({
	secret: app.sessionSecret,
    key: 'express.sid',
	store: app.sessionStore
}));
app.use(stylus.middleware(
  { src: __dirname + '/public'
  , compile: compile
  }
))
app.use(express.static(path.join(__dirname, 'public')));
app.use(everyauth.middleware(app));
app.use(i18n.init);

// set logger into middleware
app.use(apachelog.logger);

app.use(app.router);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// Import Modules
var modules = {};
if (fs.existsSync("app_modules")) {
	fs.readdirSync('app_modules').forEach(function(file) {
	  if ( file[0] == '.' ) return;
	  fs.stat('./app_modules/'+ file, function stattingModule(err, stats){
	  	var moduleName = file;
		if(err){
	  		log.error("Can not stat module '%s'", moduleName);
		} else {
			if(stats.isDirectory()){
				log.info("Add libary %s to application.", moduleName );
				modules[moduleName] = require('./app_modules/' + moduleName)(app, models);	
			} else if(stats.isFile()){
				moduleName = file.substr(0, file.indexOf('.'));
		 		log.info("Add module %s to application.", moduleName );
				modules[moduleName] = require('./app_modules/' + moduleName)(app, models);				
			}
		}
	  });
	}); 
}

// Import the routes
fs.readdirSync('routes').forEach(function(file) {
  if ( file[0] == '.' ) return;
  var routeName = file.substr(0, file.indexOf('.'));
  log.info("Add route %s to application.", routeName );
  require('./routes/' + routeName)(app, models, modules);
});

// Server 
app.server.listen(app.get('port'), function(){
	if ('development' == app.get('env')) log.notice('Server listening on port %d', app.get('port'));
});
