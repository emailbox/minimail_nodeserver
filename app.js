
/**
 * Module dependencies.
 */

// require('nodetime').profile()

var require_ssl = false;

// Credentials
// - loads from json
var fs = require('fs');
GLOBAL.creds = JSON.parse(fs.readFileSync('credentials.json', 'utf-8'));

// Required packages
var express = require('express')

	// , routes = require('./routes')
	, pages = require('./routes/pages')
	, api = require('./routes/api')

	, models = require('./models/model.js')
	, path = require('path');

// var MemcachedStore = require('connect-memcached')(express);

var app = express();

GLOBAL.models = models;
GLOBAL.app = app;


var http = require('http');

var server = http.createServer(app);
var urlLib = require('url');

// cross-domain middleware
var allowCrossDomain = function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
	res.header('Access-Control-Allow-Headers', 'Content-Type');
	//res.header("Access-Control-Allow-Headers", "X-Requested-With");
	next();
}

// rawbody middleware (not used)
var getRawBody = function(req, res, next) {
	var data = '';
	req.setEncoding('utf8');
	req.on('data', function(chunk) { 
		 data += chunk;
	});
	req.on('end', function() {
		req.rawBody = data;
		next()
	});

}

app.configure(function(){
	app.set('port', process.env.PORT || 8088);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');

	app.use(allowCrossDomain);
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.cookieParser(creds.cookie_key));
	
	app.use(express.session({ 
		secret: creds.session_secret
		// store: new MemoryStore
	}));

	// Session middleware for layout
	app.use(function(req, res, next){
		// res.locals.sess = req.session;
		next();
	});

	app.use(require('stylus').middleware(__dirname + '/public'));
	app.use(express.static(path.join(__dirname, 'public')));

	app.use(app.router);
	// app.use(flash());


});

app.configure('development', function(){
	app.use(express.errorHandler());
});

// Log incoming requests
// app.all('*',function(req,res,next){
//   var delay = 0;//500;
//   setTimeout(function(){
//     // console.log('New Request: ' + req.url);
//     next();
//   },delay);
// });

// Requiring SSL
if(require_ssl){
	app.post('*',function(req,res,next){
		if(req.headers['x-forwarded-proto'] != 'https'){
			//console.log(req.headers.host); // redirect
			jsonError(res,403,"API access requires https (ssl)");
		} else {
			next(); // is https, continue
		}
	});
}

// OPTIONS requests
app.options('*', function(req,res){
	res.send('options request');
});

// Regain session if server restarted
app.all('*',function(req,res,next){
	try {
		if(req.session.user != null){
			next();
			return;
		}
	} catch(err){
		next();
		return;
	}

	// Try to recover from a cookie
	if(req.signedCookies.user_id == null){
		next();
		return;
	}

	models.mysql.acquire(function(err, client) {
		if (err) {
			return;
		} 

		client.query(
			'SELECT * FROM f_users ' + 
			'WHERE f_users.id = ?'
			, [req.signedCookies.user_id]
			, function(error, rows, fields) {
				
				models.mysql.release(client);

				if(rows.length < 1){
					next();
					return;
				}

				// Found a user
				req.session.user = rows[0];
				next();

			}

		);

	});


});


// API tools
app.post('/api/login',api.login);
// app.post('/api/update',api.update);
app.post('/api/logout',api.logout);
// app.post('/api/emails',api.emails);

// Emails
app.post('/incoming_email',api.incoming_email);
app.post('/test_push',api.test_push);
app.post('/wait_until_fired',api.wait_until_fired); // or "firing" I suppose
app.post('/incoming_email_action',api.incoming_email_action);
app.post('/incoming_minimail_action',api.incoming_minimail_action);
app.post('/stats',api.stats);
app.post('/fullcontact',api.fullcontact);
app.post('/textteaser',api.textteaser);

// Static Pages
app.get('/', function(req,res){
	res.redirect('/app');
});
app.get('/app', pages.app); // main app page, for creating your own collections of files

// 404
app.get('*', function(req, res) { res.render('errors/404'); });

// JSON succcess/error messages
GLOBAL.jsonError = function(res, errCode, errMsg, errData){
	if (typeof errData == 'undefined'){
		errData = {};
	}

	res.send({
				code: errCode,
				msg: errMsg,
				data: errData
			});
}

GLOBAL.jsonSuccess = function(res, successMsg, successData){
	if (typeof successData == 'undefined'){
		successData = {};
	}

	res.send({
				code: 200,
				msg: successMsg,
				data: successData
			});
}

GLOBAL.jsonData = function(res, resData){
	if (typeof resData == 'undefined'){
		resData = {};
	}

	res.send(resData);
}

// Start webserver listening
server.listen(app.get('port'));

console.log('Listening on port ' + app.get('port'));




// Object extending, defaults
Object.defineProperty(Object.prototype, "extend", {
	enumerable: false,
	value: function(from) {
		var props = Object.getOwnPropertyNames(from);
		var dest = this;
		props.forEach(function(name) {
			if (name in dest) {
				var destination = Object.getOwnPropertyDescriptor(from, name);
				Object.defineProperty(dest, name, destination);
			}
		});
		return this;
	}
});