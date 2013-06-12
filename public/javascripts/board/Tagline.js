define(['Router', 'views/tagline'], 
	function(router, tagline) {
	
		// Initialize the Roaster
		var initialize = function initialize() {
			runApplication(true);
		};

		// callback to run the roaster
		var runApplication = function(runable) {
			if (runable) {
				tagline = new tagline();
			}
		};

  		return {
    		initialize: initialize
		};
		
		
});
