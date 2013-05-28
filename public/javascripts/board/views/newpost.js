define(	['Socket', 'ModalView', 'models/Post', 'text!templates/newpostformtemplate.html', 'text!globaltemplates/alert.html'],
	function(Socket, ModalView, Post, NewPostFormTemplate, AlertTemplate) {

		/**
		 * The roaster is the frame where the current online users will be palced.
		 */
		var NewpostView = Backbone.ModalView.extend({
			
			name: "Add a new post",
			
			model: Post,
			
			events: {
				"click .btn-primary": "save"			
			},
			
			initialize: function init(){
				// customize the ModalView 
				this.defaultOptions.permanentlyVisible = true;
				this.defaultOptions.backgroundClickClosesModal =  false;
				this.defaultOptions.showCloseButton = false;
				this.model = new Post();
			},
				
			render: function(){
				this.$el.html(
					_.template(
		        		NewPostFormTemplate, this
		        	)
				);
				return this;
			},
						
			save: function save(){
				console.log("Set...");
				this.model.set(this.$el.find('form').serializeObject());
				
				this.model.on("invalid", function(model, error) {
  					$('#modalhint').html(
						_.template(
							AlertTemplate, 
							{headline: 'Invalid',
							content: 'Your post is invalid and can not pushed.'}
						)
			        );
					$('#modalhint #notice').addClass('alert-error').fadeIn(300);
					
				});		
				
				console.log("Save...");
				this.model.save();
				
				console.log(this.model);
				if (this.model.isValid()) {
					$('#notices .container').html(
						_.template(
		        			AlertTemplate, 
		        			{headline: 'Saved',
		        			content: 'Your post will be saved and appears in a couple of seconds.'}
			        	)
					);
					$('#notices .container #notice').addClass('alert-success').fadeIn(300).delay(5000).fadeOut(600);;
					this.hideModal();
				}
			}
		});
		
		return NewpostView;
	}
);