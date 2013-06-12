var microtime 		= require('microtime')
	, sprintf 		= require('sprintf').sprintf
	, dateformat	= require('dateformat')
	;

// public exports
var accesslog = exports;

accesslog.version = '0.0.1';

accesslog.configure = function i18nConfigure(opt) {
  // writes logs into this directory
  directory = (typeof opt.directory === 'string') ? opt.directory : __dirname + pathsep + 'logs';

  // write log to file with name
  filename = (typeof opt.directory === 'string') ? opt.filename : 'access.log';
  
  // log format
	/**
	NCSA Common Log Format (CLF)
    "%h %l %u %t \"%r\" %>s %b"

	NCSA Common Log Format with Virtual Host
    "%v %h %l %u %t \"%r\" %>s %b"

	NCSA extended/combined log format
    "%h %l %u %t \"%r\" %>s %b \"%{Referer}i\" \"%{User-agent}i\""

	NCSA extended/combined log format with Virtual Host
    "%v %h %l %u %t \"%r\" %>s %b \"%{Referer}i\" \"%{User-agent}i\""
    **/
  format = (typeof opt.directory === 'string') ? opt.format : 'CLF';
};

accesslog.logger = function log(request, response, next) {
	var starttime =  microtime.now();
	// from behind a proxy
	var clientAddr = request.headers['X-Forwarded-For'];
	if( clientAddr == undefined ){
		// direct connection
		clientAddr = request.connection.remoteAddress;
	}
	// get username (if available)
	var username = "";
	if(request.session.user){
		username = "";
	} else {
		if(request.session.id){
			username = request.session.id;
		}	
	}
	
    console.log();
	console.log();
	console.log(request.originalUrl);
	console.log();
	
  if (typeof next === 'function') {
    next();
  }
  
  var endtime =  microtime.now();		// microseconds
  var rendertime = endtime - starttime;

  //[18/Sep/2011:19:18:28 -0400]
  
  writeToLog(
  	sprintf("%s - %s %s %d \"%s %s %s/%s\” %d", 
  		clientAddr, 
  		username, 
  		(rendertime /60/60), 
  		request.method,
  		request.url,
  		request.protocoll,
  		request.httpVersion,
  		200
  		
  	)
  );
  
  	console.log(response._headers['content-length']);
  	console.log(response.req.headers['user-agent']);
};


writeToLog = function( str ){
	console.log( str ) 
}