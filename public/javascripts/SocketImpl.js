// load in the Base Class as a dependancy
define(['SingletonAbstract', 'Socket', 'JQuery'], 
function( SingletonAbstract, Socket, jquery ){
	
	// Extend the Base class taking on all its
	var SocketImpl = SingletonAbstract;
	
	$.extend(SocketImpl.prototype, {
		socket: io.connect(),

	});

	SocketImpl.prototype.socket.on('connect', function(){
		console.log("Connected to sockets.");
	});

	return SocketImpl;
});


