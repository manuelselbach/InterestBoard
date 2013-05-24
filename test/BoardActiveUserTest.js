var assert 		= require("assert")
	, chai 		= require("chai")
	, db		= require("./lib/ConnectToDB")
	, _			= require("underscore")
	;
	
var assert = chai.assert;	
var models = {};
  
describe('Test Active Users on the board', function(){
describe("This Active-User test", function(){
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
	it('should create a test boards', function(done){
		var fn = function(err, data){
      		if(err) done(err);
      		models.Board.Board.count({}, function (err, count) {
				if (err) done(err);
				assert.equal(count, 1);
				done();
			});
		}

		models.Board.create("test", "Test", fn);
	});
	
	it('should add a user to the boards', function(done){
		var fn = function(err){
      		if(err) done(err);
      		// check count of users
 			models.Board.Board.findOne({boardname: "test"}, {currentusers: 1}, function(err, b){
	 			if(err) done(err);
 				assert.equal(b.currentusers.length, 1);
 				done();
 			});
		}
		var testuser = {
			sid: 'aaaaaaaa',
			fid: 'bbbbbbbb', 
			name: "Eduard der Ältere"
		};
		models.Board.addUserToBoard("test", testuser, fn);
	});
	
	it('should add another user to the boards', function(done){
		var fn = function(err){
      		if(err) done(err);
      		// check count of users
 			models.Board.Board.findOne({boardname: "test"}, false, function(err, b){
	 			if(err) done(err);
 				assert.equal(b.currentusers.length, 2);
 				done();
 			});
		}
		var testuser = {
			sid: 'cccccccc',
			fid: 'dddddddd', 
			name: "Richard I"
		};
		models.Board.addUserToBoard("test", testuser, fn);
	});
	
	it('should not possible to add the same user twice boards', function(done){
		var fn = function(err){
			
      		// check count of users
 			models.Board.Board.findOne({boardname: "test"}, false, function(err, b){
				if(err) done(err);
 				assert.equal(b.currentusers.length, 2);
 				done();
 			});
		}
		var testuser = {
			sid: 'cccccccc',
			fid: 'dddddddd', 
			name: "Richard I"
		};
		models.Board.addUserToBoard("test", testuser, fn);
	});
});
});
