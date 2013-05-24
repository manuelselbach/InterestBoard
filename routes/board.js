module.exports = function(app, models, modules) {

	var   String 		= require('string')
		, _ = require('underscore');
	
	// INVOKE A BOARD
	app.get('/board/:board', function (req, res) {
		if(req.session.auth && req.session.auth.loggedIn){
			// get board
			var boardname = String(req.params.board).slugify();
			
			if ('development' == app.get('env')) console.log("Rendering board '"+ boardname +"'.");

			req.session.board = boardname.s;
			models.Board.findByName(boardname, function onSearchDone(board) {
				if ( board == undefined) {
      				// board does not exists. create it :-)
      				models.Board.create(boardname, req.params.board, function onCreateDone(){
	  					res.render('board',
	  						{
	  							boardname 	: boardname,
	  							title 		: req.params.board,
	  							tagline		: '',
	  							isNew 		: true
	  						}
	  					);
      				});
			    } else {
			    	res.render('board',
	  					{
	  						boardname 	: board.boardname,
	  						title 		: board.title,
	  						tagline		: board.tagline,
	  						isNew 		: false
						}
					);
  					
			    }
			});
	    } else {
      		if ('development' == app.get('env')) {
				console.log("The user is NOT logged in, so the board '"+ req.params.board +"' can not be renderd.");
			}
      		res.redirect('/about/login');
    	}
	
	});
	
	// GET CURRENT USERS ON A BOARD
	app.get('/board/:board/users.json', function (req, res) {
		var boardname = String(req.params.board).slugify();
		models.Board.findByName(boardname, function onSearchDone(board) {
			res.send( 
			// underscoring the unwanted elements out
				_.map(board.currentusers, function(elm){
					return {
						fid: elm.fid,
						name: elm.name,
						img: elm.img,
						//updated: elm.updated,
						id: elm.id,
						location: elm.location
					};
				})
			);
		});
	});
	
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
	
	// GET CURRENT USERS ON A BOARD
	app.get('/board/:board/posts.json', function (req, res) {
		var boardname = String(req.params.board).slugify();
		models.Board.findSortedPostsByBoardName(boardname.s, function(posts){
			res.send(posts);
		});
	});
}