define(	['SocketImpl', 'UserImpl', 'models/Board', 'text!templates/tagline.html'],
	function(SocketImpl, UserImpl, BoardModel, TaglineTemplate) {

		/**
		 * The roaster is the frame where the current online users will be palced.
		 */
		var Tagline = Backbone.View.extend({
			
			userid: 0,
			
			isEditable: false,
			
			showForm: false,
			
			el: $('#tagline'),
			
			model: new BoardModel,
				
			events: {

			},
    
			// Initialize the roaster and connect the roaster to the Socket.
			initialize: function initialize() {
				var that = this;
				console.log("Fetschiung");
				that.model.fetch(
					{success: function(){
					console.log("succ");
						that.render();
					}}
				).complete(function(){
					soc = new SocketImpl();
					// new post arrive
					soc.socket.on('tagline::changed', function(data){
						console.log('tagline change: '+ data);
					});
					
					user = new UserImpl();
					that.userid = user.userid;
					
					if( that.model.get('status') == undefined 
						|| that.model.get('status') == 'new'){
						that.model.set('showForm', true);
					} else {
						if(that.model.get('created').by.fid == self.userid){
							that.model.set('isEditable', true);
						}
					}
				});

			},
			
			render: function render(){
				that = this;
				console.log("Rendering tagline.");
				that.$el.html(
		        	_.template(
		        		TaglineTemplate,
		        		that.model
		        	)
		        );
			},
			
		});
		
		return Tagline;
	}
);