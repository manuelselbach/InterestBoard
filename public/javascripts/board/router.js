define(['views/roaster', 'views/newpost', 'models/PostList'],
	function(roaster, newpost, PostList) {
		var BoardRouter = Backbone.Router.extend({

			currentModal: null,
			
			currentView: null,

			routes: {
				'login'			: 'login',

				'new'			: 'route_newpost_link',
				'newlink' 		: 'route_newpost_link',
				'newimage' 		: 'route_newpost_image',
				'newtext' 		: 'route_newpost_text',
				
				'closemodal'	: 'close_modal',
				
				//'remove/item/:id'	: 'route_remove_item'
			},
 
			changeView: function changeView(view) {
				console.log("Change Board view to: "+ view);
				if ( null != this.currentView ) {
					this.currentView.undelegateEvents();
				}
				this.currentView = view;
				if ( null != this.currentView ) {
					this.currentView.render();
				}
			},
 
			login: function login() {
				this.changeView(null);
				location.replace("/about/login");
			},
			
			route_newpost_link: function route_newpost(){
				currentModal = new newpost().render();
				currentModal.showModal();
				$('#newposttabmenu [href="#select-link"]').tab('show');	
			},

			route_newpost_image: function route_newpost(){
				currentModal = new newpost().render();
				currentModal.showModal();
				$('#newposttabmenu [href="#select-image"]').tab('show');	
			},

			route_newpost_text: function route_newpost(){
				currentModal = new newpost().render();
				currentModal.showModal();
				$('#newposttabmenu [href="#select-text"]').tab('show');	
			},
			
			/**
			route_remove_item: function route_remove_item(id){
				alert("REMOVE "+ id);
				hia PostList.remove(id);	
			},
			*/
			
			close_modal: function route_newpost(){
				currentModal.hideModal();
			},
			
		});
 
		return new BoardRouter();
	}
);
 
