module.exports = function(app, models) {

	var	String	= require('string')
	,	io 		= require('socket.io')
	,	utils 	= require('connect').utils
	,	cookie 	= require('cookie')
	,	Session	= require('connect').middleware.session.Session;

	var sio = io.listen(app.server);

	sio.configure(function() {

		sio.set('authorization', function( data, accept) {
			if ('development' == app.get('env')){
				console.log('SIO authorization');
				console.log( data );
			}

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
     		console.log(session);
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
				sio.sockets.in(session.board).emit('roaster::addUser', user.sid, user);	
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
				sio.sockets.in(session.board).emit('roaster::removeUser', user.sid, user);	
	  		});
				
			});
		});
	});
	
};