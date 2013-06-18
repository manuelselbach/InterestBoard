var assert 		= require("assert")
	, chai 		= require("chai")
	, db		= require("./lib/ConnectToDB")
	, _			= require("underscore")
	;
	
var assert = chai.assert;	
var models = {};
  
describe('Test posts', function(){
describe("create and delete post", function(){
	before(function(){
		db.connect();
		models = db.getModels();
	});

	after(function(done){
		models.Board.Board.remove({}, function(err) {
			if(err) throw err;
			db.disconnect( function (err) {
				if(err) throw err;
				done();
			})
		});
	});

	beforeEach(function(){
 
	});

	afterEach(function(){

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

		models.Board.create("testpostboard", "Test Post", fn);
	});
	
	it('should add a post to the boards', function(done){
		var fn = function(err){
      		if(err) done(err);
      		// check count of users
 			models.Board.Board.findOne({boardname: "testpostboard"}, {posts: 1}, function(err, b){
	 			if(err) done(err);
 				assert.equal(b.posts.length, 1);
 				assert.equal(b.posts[0].text, 'This is just a test');
 				done();
 			});
		}
		var post = {
			url:	'http://www.example.com',
			title:	'A Test Post',
			img:	'',
			text:	'This is just a test',
			author:		{
				sid:	'aaaaaaaa',
				fid:	'bbbbbbbb',
				name:	'Nero Claudius'			
			},
			rendered:   true
		};
		models.Board.findByName("testpostboard", function(board){
			models.Board.addPost(board, post, fn);
		});
	});

	
	it('should add another post to the boards', function(done){
		var fn = function(err){
      		if(err) done(err);
      		// check count of users
 			models.Board.Board.findOne({boardname: "testpostboard"}, {posts: 1}, function(err, b){
	 			if(err) done(err);
 				assert.equal(b.posts.length, 2);
				assert.equal(b.posts[1].text, 'This is a link to google');
 				assert.equal(b.posts[0].text, 'This is just a test');
 				done();
 			});
		}
		var post = {
			url:	'http://www.google.com',
			title:	'A Google Post',
			img:	'',
			text:	'This is a link to google',
			author:		{
				sid:	'aaaaaaaa',
				fid:	'bbbbbbbb',
				name:	'Nero Claudius'			
			},
			rendered:   true
		};
		models.Board.findByName("testpostboard", function(board){
			models.Board.addPost(board, post, fn);
		});
	});
	
	it('should return the posts in opposite order', function(done){
		var fn = function(posts){
			assert.equal(posts[0].text, 'This is a link to google');
 			assert.equal(posts[1].text, 'This is just a test');
 			done();
		}

		models.Board.findSortedPostsByBoardName("testpostboard", fn);
	});
	
	it('should remove one post', function(done){
		var fn = function(err){
			if(err) done(err);
			models.Board.Board.findOne({boardname: "testpostboard"}, {posts: 1}, function(err, b){
	 			if(err) done(err);
 				assert.equal(b.posts.length, 1);
 				done();
 			});
		}

		// remove the post
		models.Board.findByName("testpostboard", function(board){
			models.Board.removePost(board, board.posts[1].id, fn);
		});
	});
});
});
