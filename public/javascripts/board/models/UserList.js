define(['models/User'], 
	function(User) {
	
		/**
		 * List of Users
		 */
		var UserList = Backbone.Collection.extend({
		
			model: User,
			
			// this representation is fixed to boards. - If no board is selected, load a
			// empty list.
			url: function() {
				if(location.pathname.indexOf('/board') == 0){
					return location.pathname +'/users.json';
				}
				return '/mock/emptyusers.json';
			},

    		// called on Initialisation
    		initialize: function initialize(){
    			;
    		},
			
			// overwrite of the default parse method. If /users.json does not return 
			// expected format, transform it here.
    		parse: function parse(response){
       			return response;
    		},
    		
    		size: function size(){
    			return this.model.length;
    		}
		});

		return new UserList;
	}
);
