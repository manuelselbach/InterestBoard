var assert 		= require("assert")
	, chai 		= require("chai")
	, db		= require("./lib/ConnectToDB");
	;

var assert = chai.assert;	
var models = {};

describe('Test the Board model creation process', function(){
describe('run', function(){
	before(function(){
		db.connect();
		models = db.getModels();
	});

	after(function(done){
		models.Board.Board.remove({}, function(err) {
			if(err) throw err;
			db.disconnect( function (err) {
				if(err) throw err;
				//delete Board;
				done();
			})
		});
	});

	beforeEach(function(){
 
	});

	afterEach(function(){

	});

	it('should have no boards', function(done){
		models.Board.Board.count({}, function (err, count) {
			if (err) done(err);
			assert.equal(count, 0);
			done();
		});
	});
	it('should creates a new board', function(done){
		var fn = function(err, data){
      		if(err) done(err);
      		models.Board.Board.count({}, function (err, count) {
				if (err) done(err);
				assert.equal(count, 1);
				done();
			});
		}

		models.Board.create("testboard", "A Test Board", fn);
    });
	it('should creates another board', function(done){
		var fn = function(err, data){
      		if(err) done(err);
      		models.Board.Board.count({}, function (err, count) {
				if (err) done(err);
				assert.equal(count, 2);
				done();
			});
		}

		models.Board.create("secondtestboard", "A Second Board", fn);
    });
 	it('should reject the same board', function(done){
 		var fn = function(err, data){
       		models.Board.Board.count({}, function (err, count) {
	       		if(err) done(err);
 				assert.equal(count, 2);
 				done();
 			});
 		}
 
 		models.Board.create("secondtestboard", "A Second Board", fn);
     });
});
});

