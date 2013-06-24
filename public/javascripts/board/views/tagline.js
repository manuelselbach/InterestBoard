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
				'click #savetagline': 'savetagline'
			},
    
			// Initialize the roaster and connect the roaster to the Socket.
			initialize: function initialize() {
				var that = this;
				that.model.set('isEditable', false);
				that.model.set('showForm', false);
				
				user = new UserImpl();
				that.userid = user.userid;
					
				that.model.fetch(
					{success: function(){
						if( that.model.get('status') == undefined 
							|| (that.model.get('status') == 'new'
						 	&& that.model.get('created').by.fid == that.userid
							)){
							that.model.set('showForm', true);
							that.model.set('isEditable', true);
						} else {
							if(that.model.get('created').by.fid == that.userid){
								that.model.set('isEditable', true);
							}
						}
						that.render();
					}}
				).complete(function(){
					soc = new SocketImpl();
					// new post arrive
					soc.socket.on('tagline::changed', function(data){
						console.log('tagline change: '+ data);
					});
					

				});

			},
			
			render: function render(){
				that = this;
				//_.templateSettings.variable = "rc";
				that.$el.html(
		        	_.template(
		        		TaglineTemplate,
		        		that.model
		        	)
		        );
			},
			
			savetagline: function savetagline(){
				alert("SAVE THE TAGLINE");
			}
			
		});
		
		return Tagline;
	}
);