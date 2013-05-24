define(['Router', 'views/posts'], 
	function(router, posts) {
	
		// Initialize the Postsview
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

		// callback to run the postview
		var runApplication = function(authenticated) {
			if (authenticated) {
				console.log("Authenticated to run the postsview.");
				posts = new posts();
			} else {
				console.log("Failed authentication. - redirect to login.");
				window.location.hash = 'login';
			}
		};

  		return {
    		initialize: initialize
		};
		
		
});
