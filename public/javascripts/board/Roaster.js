define(['Router', 'views/roaster'], 
	function(router, roaster) {
	
		// Initialize the Roaster
		var initialize = function initialize() {
			// Insure that the user is loged in
			checkLogin(runApplication);
		};

		// Check login implementation
		var checkLogin = function(callback) {
			console.log("Check authentification...");
			$.ajax("/user/authenticated", {
				method: "GET",
				success: function checkLoginSuccess(data) {
					return callback(true);
				},
				error: function checkLoginError(data) {
					return callback(false);
				}
			});
		};

		// callback to run the roaster
		var runApplication = function(authenticated) {
			if (authenticated) {
				console.log("Authenticated to run the roaster.");
				roaster = new roaster();
			} else {
				console.log("Failed authentication. - redirect to login.");
				window.location.hash = 'login';
			}
		};

  		return {
    		initialize: initialize
		};
		
		
});
