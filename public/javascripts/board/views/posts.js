define(	['SocketImpl', 'models/PostList', 'models/Post', 'views/postItem'],
	function(SocketImpl, PostList, Post, PostItemView) {

		/**
		 * The roaster is the frame where the current online users will be palced.
		 */
		var PostsView = Backbone.View.extend({
			
			userid: 0,
			
			el: $('#posts'),
			
			model: PostList,
				
			events: {

			},
    
			// Initialize the roaster and connect the roaster to the Socket.
			initialize: function initialize() {
				var self = this;
				
				self.model.fetch(
					{success: function(){
						self.render();
					}}
				).complete(function(){
					
					soc = new SocketImpl();
				
					// new post arrive
					soc.socket.on('pinnwall::addPost', function(name, data){
						console.log('New post is added: '+ data.name);
						
					});
					
					// user left the board
					soc.socket.on('pinnwall::removePost', function(data){
						console.log('Post is removed from board: '+ data);

						// remove the post from the collecten, 
						// the view event will remove the user from the screen
						self.model.remove(
							self.model.findWhere({'_id': data})
						);
					});
					
					soc.socket.on('pinnwall::insertPost', function(data){
						console.log('New Post arrived to the board:');
						var post = new Post(data);
						// add the post to the collecten, 
						// the view event will add the post to the screen
						var view = new PostItemView({
      						model: post
						});
						view.render();
					    that.$el.prepend(view.$el);

					});
					
					soc.socket.emit('my::id', function(data){
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