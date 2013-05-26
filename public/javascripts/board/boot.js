/**
 * Boot up the interest board.
 * Loads all needed Javascripts and initalize:
 *		- The Roaster
 * 		- The Posts
 */ 

require.config({
  paths: {
    Sockets: 			'/socket.io/socket.io',
    models: 			'/javascripts/board/models',
    views:				'/javascripts/board/views',
    text: 				'/components/requirejs-text/text',
    i18n:				'/components/requirejs-i18n/i18n',
    templates: 			'/templates/board',
    globaltemplates:	'/templates',
    Router:				'/javascripts/board/router',
	Roaster: 			'/javascripts/board/Roaster',
	Posts: 				'/javascripts/board/Posts',
	Underscore:			'/components/underscore/underscore-min',
	Backbone:			'/components/backbone/backbone-min',
	Validation: 		'/components/backbone-validation/dist/backbone-validation-min',
	ModalView:			'/components/backbone-jsmodalview/Backbone.ModalDialog',
	BackboneSchema:		'/components/backbone-schema/backbone-schema'
  },
  shim: {
    'ModalView': 		['Backbone', 'Validation'],
    'Backbone':			['Underscore'],
    'Posts':			['Backbone', 'BackboneSchema']
  }
});

require(['Roaster', 'Posts'], 
	function(Roaster, Posts) {
	
		/** 
		 * Well, to keep the Roaster and the Post as seperade as possible it must implement
		 * the authentification methods each by its own. This is a overhead in the http, but
		 * shoult keep the source clean and maintainable
		 */
		
		// initialize the roaster.
		Roaster.initialize();
		
		// then, initialize the Posts.
		Posts.initialize();
	
		// Start Backbone Router History
		Backbone.history.start();	
	}
);
