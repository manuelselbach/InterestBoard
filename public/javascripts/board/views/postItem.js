define(['models/Post', 'text!templates/PostItem.html'],
	function(Post, PostItemTemplate) {

		/**
		 * The PostItem is a single post that will be placed in the center screen
		 */
		var PostItemView = Backbone.View.extend({
			
			tagName: 'div',
			
			$el: $(this.el),
			
			model: Post,
										
			events: {
				"click"   	: "selectItem",
				"mouseover"	: "hoverInItem",
				"mouseout"	: "hoverOutItem"
			},
    
    		// Initialize the item
			initialize: function initialize() {
				console.log("init views/postItem");
				// remove from the screen, when remove from a collection
				this.model.bind('remove', this.remove, this);
			},

    		// default render function to display the roaster 
		    render: function render() {
		    	console.log("render views/postItem");
				 var that = this;
				 this.$el.html(
		        	_.template(
		        		PostItemTemplate, that.model
		        	)
		        );	
		        
		        return this;		        	
		    },
		    
		    // remove the item from the screen
			remove: function remove() {
				$(this.el).remove();
			},

			// on selection
		    selectItem: function selectItem() {
		    	console.log('Select post: '+ this.model.get('title'));
		    	console.log(this.model);
		    },
					    
		    // animate the chathead on moseover
		    hoverInItem: function hoverInItem() {
		    	var that = this;
		    	if( this.model.isRemovable ){
		    		//alert("enable button remove");
		    		this.$el.find('#removepost').show();
		    		// this.$el.find('#removepost').attr('href', "#remove/item/"+ this.model.get('_id'));
					this.$el.find('#removepost').bind('click', function(){
						if(location.pathname.indexOf('/board') == 0){
							var url = location.pathname +'/post?id='+ that.model.get('_id');
							$.ajax({
								url: url,
								contentType: 'application/json',
								dataType: 'text',
								error: function( xhr, status, err){
									alert("An error occured: "+ status +", "+ err);
								},
								succsess: function( data, status, xhr ){
									alert("OK");
								},
								type: 'DELETE',
							
							});
	
						} else {
							alert("You have to seect a board.");
						}
					});
		    		
		    	} else {
		    		this.$el.find('#removepost').hide();
		    	}
		    	this.$el.find('div.inner').fadeIn(300);
		    },
		    // animate the chathead on moseover
		    hoverOutItem: function hoverOutItem() {
		    	this.$el.find('div.inner').fadeOut(300);
		    }
		    
		    
      	});

  		return PostItemView;
	}
);
