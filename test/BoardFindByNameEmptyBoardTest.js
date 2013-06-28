var assert 		= require("assert")
	, chai 		= require("chai")
	, db		= require("./lib/ConnectToDB");
	;

var assert = chai.assert;	
var models = {};
var testuser = {
			sid: 'aaaaaaaa',
			fid: 987654321, 
			name: "Eduard der Ältere",
			picture: {
				url: ''
			}
		};

describe('Test the Board find by name process but without posts inside the board', function(){
describe('run', function(){
	before(function(done){
		db.connect();
		models = db.getModels();
		models.Board.create("testboard", "A Test Board", testuser, function beforeCB(err, data){	
			done();
		} );
	});

	after(function(done){
		models.Board.Board.remove({}, function afterCB(err) {
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

	it('should get the board by name with posts', function(done){
		models.Board.findByNameWithPosts('testboard', function findWithNameCB(board) {
			assert.ok(board != undefined);
 			assert.ok(board.boardname.length > 0);
			done();
		});
	});
	it('should get the board by name', function(done){
		models.Board.findByName('testboard', function findCB(board) {
			assert.ok(board != undefined);
			assert.ok(board.boardname.length > 0);
			done();
		});
	});

});
});

