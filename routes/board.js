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
						id: elm.fid,
						location: elm.location
					};
				})
			);
		});
	});
	
}