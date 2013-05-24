define(['models/User', 'text!templates/roasterItem.html'],
	function(User, RoasterItemTemplate) {

		/**
		 * The RoasterItem is a single user that will be placed onto the roaster, while 
		 * the user is online and visiting the current board.
		 */
		var RoasterItemView = Backbone.View.extend({
			
			tagName: 'li',
			
			className: 'chathead',
			
			$el: $(this.el),
			
			model: User,
							
			events: {
				"click"   	: "selectItem",
				"mouseover"	: "hoverInItem",
				"mouseout"	: "hoverOutItem"
			},
    
    		// Initialize the item
			initialize: function initialize() {
				// remove from the screen, when remove from a collection
				this.model.bind('remove', this.remove, this);
			},

    		// default render function to display the roaster 
		    render: function render() {
				 var that = this;
				 this.$el.html(
		        	_.template(
		        		RoasterItemTemplate, that.model
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
		    	console.log('Select views/roasterItem: '+ this.model.get('name'));
		    },
					    
		    // animate the chathead on moseover
		    hoverInItem: function hoverInItem() {
		    	var that = this;
		    	var size = that.$el.find('img').width();
		    	var newsize = size + 8;
		    	this.$el.find('img').animate({
				    width: newsize + 'px',
				    height: newsize + 'px',
				    opacity: '1'
				  }, 500, function() {
				    // Animation complete.
				    ;
				  });
		    },
		    // animate the chathead on moseover
		    hoverOutItem: function hoverOutItem() {
				var that = this;
				var size = that.$el.find('img').width();
				var newsize = size - 8;
				this.$el.find('img').animate({
					width:  '50px',
					height: '50px',
					opacity: '0.8'
				}, 300, function() {
				    // Animation complete.
				    ;
				});
		    }
		    
		    
      	});

  		return RoasterItemView;
	}
);
