// clear the cache - because the models are precompiled! 
for (var key in require.cache) {delete require.cache[key];}
	
var mongoose 	= require('mongoose')
	, gridfs 	= require('gridfs-stream')
	, Log 		= require('log')
	, fs 		= require('fs')
	;

var log = new Log('debug', fs.createWriteStream('test.log'));

// set the application environment to test! Always Test! 
var app = { 
	env: 'test',
	get: function(key){
		if(key == 'env'){
			return "test";
		}
	},
	log: log
};
	
// initialise the model object
var models = {};

// clear the models.
mongoose.models = {};
mongoose.modelSchemas = {};

// do not bother the output with debug logs
mongoose.set('debug', false);
	

exports.connect = function(){
	// Connect to the local Test-Database - it has to be startet already.
	app.dbconnection = mongoose.connect('mongodb://localhost/InterestBoard_test');
	// route the errors to nothing - eg. reconnection errors.
	mongoose.connection.on('error', function() {});

	// Register the models.
	models.Board = require("../../models/Board.js")(app, mongoose);
};

exports.getModels = function(){
	return models;
};

exports.disconnect = function(err){
	mongoose.disconnect(err);
}
	
