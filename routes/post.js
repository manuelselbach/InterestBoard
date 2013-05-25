module.exports = function(app, models, modules) {

	var   String 		= require('string')
		, _ = require('underscore');
	

	
	// INSERT A NEW POST
	app.post('/board/:board/post', function (req, res){
		var boardname = String(req.params.board).slugify();
		if( req.session.user.location == undefined ){
			req.session.user.location = {
				id: 0,
				name: '' 
			}
		};
		
		// Construct the post
		var post = {
			url: req.body.url,
			img: req.body.img,
			title: req.body.title,
			text: req.body.text,
			author: {
				sid: req.session._sessionid,	
				fid: req.session.user.id,
				name: req.session.user.name,
				img: req.session.user.picture.data.url,
				hometown: { 
					fid: req.session.user.hometown.id,
					name: req.session.user.hometown.name
				},
				location: {
					fid: req.session.user.location.id,
					name: req.session.user.location.name
				},
				updated: new Date() 
			},
			rendered: false
		};

		// Call rendering engine, than insert the post
		models.Board.findByName(boardname, function renderAndInsert(board){
			
			app.eventEmitter.emit('post::shouldRender', post, function insertPost(post){
				models.Board.addPost(board, post, function(err){
					if(err){
						console.log("There is a problem inserting the post.");
						console.log(post);
						console.log("To Board:");
						console.log(board);
					}
				});			
			});
		});
		
		// !! not in callback to get back soon! 
		res.send(200);	
	});
	
	// REMOVE A POST FROM THE BOARD
	app.delete('/board/:board/post', function (req, res){
		var boardname = String(req.params.board).slugify();
		var postid = req.query["id"];
		console.log("DELETE POST AND SEND EVENT "+ postid);
		models.Board.findByName(boardname, function(board){
			models.Board.removePost(board, postid, function(err){
				res.contentType('application/json');
				if(err){
					res.send(500);	
				} else {
					res.send(200);
					app.eventEmitter.emit('post::removed', postid);
				}
			});
		});
	});
	
	// GET ALL POSTS FROM A BOARD
	app.get('/board/:board/posts.json', function (req, res) {
		var boardname = String(req.params.board).slugify();
		models.Board.findSortedPostsByBoardName(boardname.s, function(posts){
			res.send(posts);
		});
	});

}