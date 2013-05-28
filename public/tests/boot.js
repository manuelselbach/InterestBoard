/**
 * Boot up the test framework.
 * Loads all needed Javascripts
 */ 

require.config({
  paths: {
    models: 			'../javascripts/board/models',
    views:				'../javascripts/board/views',
    text: 				'../components/requirejs-text/text',
    i18n:				'../components/requirejs-i18n/i18n',
    templates: 			'/templates/board',
    Router:				'../javascripts/board/router',
	Roaster: 			'../javascripts/board/Roaster',
	Posts: 				'../javascripts/board/Posts',
	Underscore:			'/components/underscore/underscore',
	Backbone:			'../components/backbone/backbone',
	Validation: 		'../components/backbone-validation/dist/backbone-validation-min',
	ModalView:			'../components/backbone-jsmodalview/Backbone.ModalDialog',
	BackboneSchema:		'../components/backbone-schema/backbone-schema',
	SingletonAbstract:	'../javascripts/Singleton',
	SocketImpl:			'../javascripts/SocketImpl',
	Socket: 			'/socket.io/socket.io',
	JQuery:				'../components/jquery/jquery',
	QUnit:				'../components/qunit/qunit',
	sinon:				'../components/sinon/lib/sinon',
	QSinon:				'../components/sinon-qunit/pkg/sinon-qunit-1.0.0',
	cases:				'./cases'
  },
  shim: {
    'ModalView': 		['Validation'],
    'QSinon':			['QUnit', 'sinon'],
    'models':			['Backbone'],
    'Backbone':			['Underscore'],
    'Posts':			['Backbone', 'BackboneSchema'],
    'SocketImpl':		['SingletonAbstract', 'Socket']
  }
});

require(['JQuery', 'QUnit', 'cases/require',  'cases/postModelTest', 'cases/postListModelTest',
	'cases/userModelTest', 'cases/singeltonTest', 'cases/socketImplTest'], 
	function(jquery, qunit, Requiretest, PostModelTest, PostListModelTest,
		UserModelTest, SingeltonTest, SocketImplTest) {

		$(function() {
			QUnit.config.autostart = false;
			
			console.log("Begin self test.");
			module( "Init tests." );	
			test( "Selftest", function(){
				ok( true, "The test suite is loaded succeeded.");
			});

			console.log("Begin test suite.");		
			Requiretest.run();
			//RoasterItemViewTest.run();
			
			PostModelTest.run();
			PostListModelTest.run();
			UserModelTest.run();
			SingeltonTest.run();
			SocketImplTest.run();
			
			console.log("Done.");	
			QUnit.start();
			QUnit.load();
			
		});

	}
);
