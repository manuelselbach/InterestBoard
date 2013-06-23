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

var firsttestpost =  {
	url:		'http://www.interestboard.de',
	title:		'InterestBoard',
	img:		'test.jpg',
	text:		'this post is just a test',
	author:		testuser,
	added:		Date.now,
	rendered:   true
	};
	
var secondtestpost =  {
	url:		'http://www.google.de',
	title:		'Google',
	img:		'google.jpg',
	text:		'this post is just a second test',
	author:		testuser,
	added:		Date.now,
	rendered:   true
	};

describe('Test the Board find by name process', function(){
describe('run', function(){
	before(function(done){
		db.connect();
		models = db.getModels();
		models.Board.create("testboard", "A Test Board", testuser, function beforeCB(err, data){
			models.Board.addPost(data, firsttestpost, function(err, post){
				if(err) console.log("ERROR: "+ err);
				
				models.Board.addPost(data, secondtestpost, function(err, post){
					if(err) console.log("ERROR: "+ err);
					
					done();
				});
			
			});
			
//			done();
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
			assert.ok(board.posts != undefined);
 			assert.ok(board.boardname.length > 0);
			done();
		});
	});
	it('should get the board by name', function(done){
		models.Board.findByName('testboard', function findCB(board) {
			assert.ok(board != undefined);
			assert.ok(board.posts == undefined);
			assert.ok(board.boardname.length > 0);
			done();
		});
	});

});
});

