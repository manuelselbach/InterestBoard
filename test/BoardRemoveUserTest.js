var assert 		= require("assert")
	, chai 		= require("chai")
	, db		= require("./lib/ConnectToDB")
	, _			= require("underscore")
	;
	
var assert = chai.assert;	
var models = {};
  
describe('Test removing users from the board', function(){
	describe("The current active user test ", function(){
	
		before(function(){
			db.connect();
			models = db.getModels();
			// initial create a board 
			var fn = function(err, data){
				if(err) throw err;
				models.Board.Board.count({}, function (err, count) {
					if (err) done(err);
					assert.equal(count, 1);
				});
			}

			models.Board.create("testactiveuser", "Test", fn);

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

		it('should add a user to the boards', function(done){
			var fn = function(err){
				if(err) done(err);
				// check count of users
				models.Board.Board.findOne({boardname: "testactiveuser"}, {currentusers: 1}, function(err, b){
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
			models.Board.addUserToBoard("testactiveuser", testuser, fn);
		});
	
		it('should add another user to the boards', function(done){
			var fn = function(err){
				if(err) done(err);
				// check count of users
				models.Board.Board.findOne({boardname: "testactiveuser"}, false, function(err, b){
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
			models.Board.addUserToBoard("testactiveuser", testuser, fn);
		});

		it('should explizit remove the second user from the boards', function(done){
			var fn = function(err){
				if(err) done(err);
				// check count of users
				models.Board.Board.findOne({boardname: "testactiveuser"}, false, function(err, b){
					if(err) done(err);
					assert.equal(b.currentusers.length, 1);
					var filterd = _.filter(b.currentusers, function(user){ return user.name.indexOf('Eduard der Ältere') == 0; });
					assert.equal(filterd.length, 1);
					assert.equal(filterd[0].sid, 'aaaaaaaa');
					done();
				});
			}
			var testuser = {
				sid: 'cccccccc'
			}
			models.Board.removeUserFromBoard("testactiveuser", testuser, fn)
		});
	
		it('should remove the rest users from all boards', function(done){
			var fn = function(err){
				if(err) done(err);
				// check count of users
				models.Board.Board.findOne({boardname: "testactiveuser"}, false, function(err, b){
					if(err) done(err);
					assert.equal(b.currentusers.length, 0);
					done();
				});
			}
			models.Board.removeAllActiveUsersFromAllBoards(fn)
		});
		
	});
});
