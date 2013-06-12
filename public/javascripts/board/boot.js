/**
 * Boot up the interest board.
 * Loads all needed Javascripts and initalize:
 *		- The Roaster
 * 		- The Posts
 */ 

require.config({
  paths: {
	JQuery:				'../components/jquery/jquery',
  	SingletonAbstract:	'/javascripts/Singleton',
    Socket: 			'/socket.io/socket.io',
    SocketImpl:			'/javascripts/SocketImpl',
    UserImpl:			'/javascripts/UserImpl',
    models: 			'/javascripts/board/models',
    views:				'/javascripts/board/views',
    text: 				'/components/requirejs-text/text',
    i18n:				'/components/requirejs-i18n/i18n',
    templates: 			'/templates/board',
    globaltemplates:	'/templates',
    Router:				'/javascripts/board/router',
	Roaster: 			'/javascripts/board/Roaster',
	Tagline: 			'/javascripts/board/Tagline',
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
    'Posts':			['Backbone', 'BackboneSchema'],
    'SingletonAbstract':['JQuery'],
    'SocketImpl':		['SingletonAbstract', 'Socket'],
    'UserImpl':			['SingletonAbstract']
  }
});

require(['Roaster', 'Tagline', 'Posts'], 
	function(Roaster, Tagline, Posts) {
	
		/** 
		 * Well, to keep the Roaster and the Post as seperade as possible it must implement
		 * the authentification methods each by its own. This is a overhead in the http, but
		 * shoult keep the source clean and maintainable
		 */
		
		// initialize the roaster.
		Roaster.initialize();
		
		// initialize the tagline.
		Tagline.initialize();
		
		// then, initialize the Posts.
		Posts.initialize();
	
		// Start Backbone Router History
		Backbone.history.start();	
	}
);
