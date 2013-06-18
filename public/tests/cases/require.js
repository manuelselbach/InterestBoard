
define(function(){
	
	var initialize = function initialize() {
		tests();
	};
	
	var tests = function(){
		module( "Require-Test", {
			setup: function() {
				// run before
			},
			teardown: function() {
				// run after
			}
		});
		
		test( "test that requires work.", function(){
			ok( true, "the test succeeds");
		});
	};
		
	return {
		run: initialize
	};
});
