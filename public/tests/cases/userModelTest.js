
define(['QUnit', 'models/User'], function(qunit, User){
	
	var initialize = function initialize() {
		test_userModel();
	};
	
	var test_userModel = function(){
		console.log('.test_userModel');
		
		module( "User Model-Test", {
			setup: function() {
				// run before
			},
			teardown: function() {
				// run after
			}
		});
		
		test( "Create an empty user.", function(){
    		var user = new User();
    		equal( user.get("name"), "" );
    		equal( user.get("id"), 0 );
    		equal( user.get("img"), "/images/blank.png" );
    		equal( user.get("notdefined"), undefined );
    		ok( user.validate().indexOf('A user without an name is not possible.'));
		});
		
		test( "Create a valid user.", function(){
			var user = new User({
				name: "Oliver Cromwell",
				img: "/tests/images/ocromwell.png"
			});
			ok( user.validate() == undefined );
		});
		
		/*
		{
		"sid": "9-TC8jt5gca-6yApPGraJp02",
		"fid": 1805383408,
		"name": "Peter Shaw",
		"img": "https://fbcdn-profile-a.akamaihd.net/hprofile-ak-prn1/49852_1805383408_5205_q.jpg",
		"updated": "2013-05-21T09:14:09.973Z",
		"_id": "519b3ae19221e73363000004",
		"id": "519b3ae19221e73363000004",
		"location": {
		  "fid": 110221372332205,
		  "name": "Frankfurt, Germany"
		},
		"hometown": {
		  "fid": 115823945095170,
		  "name": "Offenbach, Hessen"
		}
    	*/
		test( "Create a full valid user.", function(){
			var user = new User({
				"fid": 1805383408,
				"name": "Peter Shaw",
				"img": "https://fbcdn-profile-a.akamaihd.net/hprofile-ak-prn1/49852_1805383408_5205_q.jpg",
				"updated": "2013-05-21T09:14:09.973Z",
				"id": "519b3ae19221e73363000004",
				"location": {
					"fid": 110221372332205,
					"name": "Frankfurt, Germany"
				},
				"hometown": {
					"fid": 115823945095170,
					"name": "Offenbach, Hessen"
				}
			});
			ok( user.validate() == undefined );
		});
		
		/**
		test( "Do not allow the _id in the user obj.", function(){
			var user = new User({
				name: "Oliver Cromwell",
				img: "/tests/images/ocromwell.png",
				"_id": "519b3ae19221e73363000004"
			});
			ok( user.validate() != undefined );
		});

		test( "Do not allow the session_id in the user obj.", function(){
			var user = new User({
				name: "Oliver Cromwell",
				img: "/tests/images/ocromwell.png",
				sid: "9-TC8jt5gca-6yApPGraJp02"
			});
			ok( user.validate() != undefined );
		});
		
		
		test( "Create an invalid user.", function(){
			var user = new User({
				name: "Oliver Cromwell",
				img: "/tests/images/ocromwell.png",
				notdefined: "foo"
			});
			ok( user.validate() != undefined );
		});
		*/
	};
		
	return {
		run: initialize
	};
});
