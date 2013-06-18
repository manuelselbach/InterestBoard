// load in the Base Class as a dependancy
define(['SingletonAbstract', 'SocketImpl', 'JQuery'], 
function( SingletonAbstract, SocketImpl, jquery ){
	
	// Extend the Base class taking on all its
	var UserImpl = SingletonAbstract;
	soc = new SocketImpl();
	
	$.extend(UserImpl.prototype, {
		userid: 0,
		getMyId: function(){
			console.log("EMIT");
			soc.socket.emit('my::id', function(data){
				console.log("my:id: "+ data);	
				UserImpl.prototype.userid = data;
			});
		}
	});
	UserImpl.prototype.getMyId();
	
	return UserImpl;
});


