define(	['Underscore', 'Sockets', 'models/User', 'models/UserList', 'views/roasterItem', 'text!templates/roaster.html', 'text!templates/roasterItem.html'],
	function(u, Sockets, User, UserList, RoasterItemView, RoasterTemplate, RoasterItemTemplate) {

		/**
		 * The roaster is the frame where the current online users will be palced.
		 */
		var RoasterView = Backbone.View.extend({
			
			el: $('#roaster'),
			
			model: UserList,
				
			events: {
				
			},
    
			// Initialize the roaster and connect the roaster to the sockets.
			initialize: function initialize() {
				var self = this;

				// download the initial list of current online users
				this.model.fetch({
					success: function(){
						self.render();
					}
				}).complete(function(){
					
					socket = io.connect();
					socket.on('connect', function(){
						console.log("Roaster is connected to sockets.");
					});
				
					// new user arrive
					socket.on('roaster::addUser', function(name, data){
						console.log('New user is online: '+ data.name);
						
						// create the user object					
						newuser = new User({
							id: data.sid,
							name: data.name, 
							img: data.img
						});
						// add to model
						UserList.add(newuser);

						// display the user - this can be moved to teh view roasteritem on further releases
						var roasterItemView = new RoasterItemView({ model : newuser });
						self.$el.find('#roaster_userlist').append( 
							roasterItemView.render().el
						);
					});
					
					// user left the board
					socket.on('roaster::removeUser', function(name, data){
						console.log('User left this board: '+ data.name +" ("+ data.sid +")");
						
						// remove the user from the collecten, 
						// the view event will remove the user from the screen
						self.model.remove(
							data.sid 
						);
						
					});
				}); // - on complete
			},

			// default render function to display the roaster 
		    render: function render() {
		        this.$el.html(
		        	_.template(
		        		RoasterTemplate
		        	)
		        );
				
				// add the known users to the roaster		        		
		        var usermodel = this.model.toJSON();
		        var that = this;
		        _.each(usermodel, function(elementJson){
		        	var roasterItemView = new RoasterItemView({ 
		        		model : new User({
		        			id: elementJson.id,
		        			name: elementJson.name,
		        			img: elementJson.img
		        		}) 
		        	});
					that.$el.find('#roaster_userlist').append( 
						roasterItemView.render().el
					);		        	
		        });
		    }
      	});

  		return RoasterView;
	}
);
