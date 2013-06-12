define(	['SocketImpl', 'UserImpl', 'models/Board', 'text!templates/tagline.html'],
	function(SocketImpl, UserImpl, BoardModel, TaglineTemplate) {

		/**
		 * The roaster is the frame where the current online users will be palced.
		 */
		var Lagline = Backbone.View.extend({
			
			userid: 0,
			
			el: $('#tagline'),
			
			model: new BoardModel,
				
			events: {

			},
    
			// Initialize the roaster and connect the roaster to the Socket.
			initialize: function initialize() {
				var that = this;
				that.model.fetch();
				/**
					{success: function(){
						self.render();
					}}
				).complete(function(){
					
					soc = new SocketImpl();
				
					// new post arrive
					soc.socket.on('tagline::changed', function(data){
						console.log('tagline change: '+ data);
					});
					
					user = new UserImpl();
					console.log("my id: "+ user.userid);	
					self.userid = user.userid;
					if(board.created.by.fid == self.userid){
						post.isEditable = true;
					}
				});
				*/
			},
			
			render: function render(){
				that = this;
				that.$el.html(
		        	_.template(
		        		TaglineTemplate,
		        		that.model
		        	)
		        );
			},
			
		});
		
		return Lagline;
	}
);