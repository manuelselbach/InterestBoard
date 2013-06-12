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
				if ( board == undefined || board.posts.length == 0) {
      				// board does not exists. create it :-)
      				models.Board.create(boardname, req.params.board, req.session.auth.facebook.user, function onCreateDone(err){
      					if(err) app.log.error("While creating a new board %s %s", boardname, err);
	  					res.render('board',
	  						{
	  							boardname 	: boardname,
	  							creatorname	: req.session.auth.facebook.user.name,
	  							creatorid	: req.session.auth.facebook.user.id,
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
	  						creatorname	: req.session.auth.facebook.user.name,
	  						creatorid	: req.session.auth.facebook.user.id,
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
	
	// GET BOARD INFO
	app.get('/board/:board/info.json', function (req, res) {
		var boardname = String(req.params.board).slugify();
		models.Board.findByName(boardname, function onSearchDone(board) {
			hia
			console.log(board);
			
			res.send( 
			// underscoring the unwanted elements out
				_.map(board, function(elm){
					return {
						id: elm.id,
						status: elm.status,
						boardname: elm.boardname,
						title: elm.title,
						tagline: elm.tagline,
						added: elm.added,
						updated: elm.updated
					};
				})
			);
		});
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
						id: elm.fid,
						location: elm.location
					};
				})
			);
		});
	});
	
}