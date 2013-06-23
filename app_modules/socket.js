module.exports = function(app, models) {

	var	String	= require('string')
	,	io 		= require('socket.io')
	,	utils 	= require('connect').utils
	,	cookie 	= require('cookie')
	,	Session	= require('connect').middleware.session.Session;

	var sio = io.listen(app.server);

	sio.configure(function() {

		sio.set('authorization', function( data, accept) {
			var signedCookies = cookie.parse(data.headers.cookie);
			var cookies = utils.parseSignedCookies(signedCookies,app.sessionSecret);
			data.sessionID = cookies['express.sid'];
		
			data.sessionStore = app.sessionStore;
			data.sessionStore.get(data.sessionID, function(err, session) {
				if ( err || !session ) {
					console.log("SIO INVALID SESSION");
					return accept('Invalid session', false);
				} else {
					data.session = new Session(data, session);
					accept(null, true);
				}
			});
		});

		sio.sockets.on('connection', function (socket) {
			if ('development' == app.get('env')) console.log( socket );
     		var session = socket.handshake.session;
     		
     		if(session.user == undefined){
     			if ('development' == app.get('env')) console.log("User is unkonwn!");
				socket.emit('Not authenticated!');
				return;
     		}
     		
			if ('development' == app.get('env')) console.log("Join sockeet to board: "+ session.board);
			socket.join(session.board);
			
			if( session.user.location == undefined ){
				session.user.location = {
					id: 0,
					name: '' 
				}
			};
			
			var user = {
				sid: session.id,	
				fid: session.user.id,
				name: session.user.name,
				img: session.user.picture.data.url,
				hometown: { 
					fid: session.user.hometown.id,
					name: session.user.hometown.name
				},
				location: {
					fid: session.user.location.id,
					name: session.user.location.name
				},
				updated: new Date() 
			};
			
			models.Board.addUserToBoard(session.board, user, function onAddUserDone(){
				// Tell everyone that i am arived!
				var suser = user;
				suser.sid = undefined;
				sio.sockets.in(session.board).emit('roaster::addUser', user.fid, suser);	
	  		});
			
			socket.on('initialboardmember', function(data){
     			console.log("SIO retrive event: initialboardmember");
			});
     	
			socket.on('my::id', function(callback){
     			callback(user.fid);
			});
			
			socket.on('disconnect', function(){
				if ('development' == app.get('env')) console.log('SIO disconnect');
				models.Board.removeUserFromBoard(session.board, user, function onRemoveUserDone(){
					// Tell everyone that i am left!
					var suser = user;
					suser.sid = undefined;
					sio.sockets.in(session.board).emit('roaster::removeUser', user.fid, suser);	
	  			});			
			});
			
			
			
		});
		
		app.eventEmitter.on('post::removed', function(board, postid){
			console.log("Send remove event to all registed users to remove a post "+ postid 
			+" to boardmembers of "+ board.boardname);
			sio.sockets.in(board.boardname).emit('pinnwall::removePost', postid);
		});
		
		app.eventEmitter.on('post::inserted', function(board, post){
			console.log("Send event to all registed users to add a post "+ post._id 
			+" to boardmembers of "+ board.boardname);
			sio.sockets.in(board.boardname).emit('pinnwall::insertPost', post);
		});
		
	});
	
};