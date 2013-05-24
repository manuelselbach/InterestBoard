define(	['Sockets', 'models/PostList', 'views/postItem'],
	function(Sockets, PostList, PostItemView) {

		/**
		 * The roaster is the frame where the current online users will be palced.
		 */
		var PostsView = Backbone.View.extend({
			
			userid: 0,
			
			el: $('#posts'),
			
			model: PostList,
				
			events: {

			},
    
			// Initialize the roaster and connect the roaster to the sockets.
			initialize: function initialize() {
				var self = this;
				
				self.model.fetch(
					{success: function(){
						self.render();
					}}
				).complete(function(){
					socket = io.connect();
					socket.on('connect', function(){
						console.log("Pinwall is connected to sockets.");
					});
				
					// new post arrive
					socket.on('pinnwall::addPost', function(name, data){
						console.log('New post is added: '+ data.name);
						
					});
					
					// user left the board
					socket.on('pinnwall::removePost', function(name, data){
						console.log('Post is removed from board: '+ data.name);

						// remove the user from the collecten, 
						// the view event will remove the user from the screen
						self.model.remove(
							self.model.get( data._id )
						);
					});
					
					socket.emit('my::id', function(data){
						console.log("my id: "+ data);	
						self.userid = data;
						self.model.each(function(post, i) {
							if(post.attributes.author.fid == self.userid){
								post.isRemovable = true;
							}
						});
					});

				});
			},
			
			render: function render(){
				that = this;
				this.model.each(function(post, i) {
					piv = new PostItemView({
						model: post,
					});
					that.$el.append(
						piv.render().el
					);
				  	
				});
			},
			
		});
		
		return PostsView;
	}
);