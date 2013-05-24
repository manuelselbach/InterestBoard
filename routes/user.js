module.exports = function(app, models, modules) {
	app.get('/user/authenticated', function (req, res) {
		if(req.session.auth && req.session.auth.loggedIn){
			if ('development' == app.get('env')) {
				console.log("User '"+ req.session.auth.facebook.user.name +"' ("+ req.session.auth.facebook.user.id +") is authenticated.");
			}
			req.session.loggedIn 	= true;
			req.session.accountId 	= req.session.auth.facebook.user.id;
			req.session.user 		= req.session.auth.facebook.user;
			console.log(req.session.auth.facebook.user);
			res.send(200);
	    } else {
      		if ('development' == app.get('env')) {
				console.log("User is not authenticated!");
			}
			req.session.loggedIn = null;
			req.session.accountId = null;
			req.session.user = null;
      		res.send(401);
    	}
	
	});
}