define(['Backbone', 'Underscore', 'models/Post'], 
	function(backbone, u, Post) {
	
		/**
		 * List of Users
		 */
		var PostList = Backbone.Collection.extend({
			
			model: Post,
			
			// this representation is fixed to boards. - If no board is selected, load a
			// empty list.
			url: function() {
				if(location.pathname.indexOf('/board') == 0){
					return location.pathname +'/posts.json';
				}
				return '/mock/emptyposts.json';
			},
			
			add: function(newPost){
				if(newPost){
					var isDupe = this.findWhere( {url: newPost.url} ) 
					if(isDupe){
				    	console.log( isDupe.get('url') );
				    	//alert('increase the counter');
				    } else {
						Backbone.Collection.prototype.add.call(this, newPost);				    
				    }
			    }
			},

    		// called on Initialisation
    		initialize: function initialize(){
    			console.log("PostList init");
    		},
    		
    		
		});

		return new PostList;
	}
);
