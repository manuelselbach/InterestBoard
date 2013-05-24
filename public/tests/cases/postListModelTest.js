
define(['QUnit', 'models/PostList'], function(qunit, PostList){
	
	var initialize = function initialize() {
		test_postListModel();
	};
	
	var test_postListModel = function(){
		console.log('.test_postListModel');
		var postlist;
		
		module( "PostList Model-Test", {
			setup: function() {
				postlist = PostList;
			},
			teardown: function() {
				postlist.reset();
			}
		});
		
		test( "Create an empty PostList.", function(){
    		var postlist = PostList;
    		equal(postlist.length, 0);
    	});
    	
    	test( "Create a PostList and add two different urls.", function(){
    		
    		postlist.add(
			  {url: "http://www.example.de/1"}
			);
	   		postlist.add(
			  {url: "http://www.example.de/2"}
			);

   			equal(postlist.length, 2);
		});
		
    	test( "Create a PostList and add two same urls.", function(){
    		var postlist = PostList;
    		postlist.add(
			  {url: "http://www.example.de"}
			);
    		postlist.add(
			  {url: "http://www.example.de"}
			);

   			equal(postlist.length, 1);
		});

	};
		
	return {
		run: initialize
	};
});
