
define(['QUnit', 'models/Post'], function(qunit, Post){
	
	var initialize = function initialize() {
		test_postModel();
	};
	
	var test_postModel = function(){
		console.log('.test_postModel');
		
		module( "Post Model-Test", {
			setup: function() {
				// run before
			},
			teardown: function() {
				// run after
			}
		});
		
		test( "Create an empty Post.", function(){
    		var post = new Post();
    		console.log("---");
    		console.log(post);
    		equal( post.get("url"), "" );
    		equal( post.get("img"), "" );
    		equal( post.get("text"), "" );
    		equal( post.get("title"), "" );
    		equal( post.get("notdefined"), undefined );
    		ok( post.validate().indexOf('A post without an url is not possible.'));
		});
		
		test( "Create a valid Post.", function(){
    		var post = new Post({url: 'http://www.example.com'});
    		equal( post.get("url"), "http://www.example.com" );
    		equal( post.validate(), undefined);
		});
		
		test( "Create an prefilled Post.", function(){
    		var post = new Post({url: 'http://example.com', text: 'test', notdefined: 'foo'});
    		ok( post.validate().indexOf('notdefined are not in the schema') );

		});
	};
		
	return {
		run: initialize
	};
});
