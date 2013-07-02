
define(['QUnit', 'UserImpl', 'AllSinon'], function(qunit, UserImpl, Sinon){

	var initialize = function initialize() {
		test_UserImpl();
	};
	
	var test_UserImpl = function(){
		console.log('.test_UserImpl');
		
		module( "Module UserImplementation-Test", {
			setup: function() {
				// xhr = sinon.useFakeXMLHttpRequest();
// 				requests = [];
// 				xhr.onCreate = function(req) {
// 					console.log("PUSH REQUEST:");
// 					console.log(req);
// 					requests.push(req);
// 				};
			},
			teardown: function() {
				 //if(xhr != 'undefined') xhr.restore();
			}
		});
		
		test( "Should be a Singleton", function(){
    		var ss1 = new UserImpl();
    		ss1.setValue("set test string to the first instance")
    		var ss2 = new UserImpl();
    		ss2.userid = "999";
    		ss1.userid = "111";
    		equal( ss2.userid,  ss1.userid);
    		equal( ss2.userid,  "111" );
		});
		
		test("should get the userid from the server", function(){
			// Test setup:
			//console.log("***");
			//var dummySocket = { send : sinon.spy() };
			//sinon.stub(window, 'SocketImpl').returns(dummySocket);
			
//			var spy = sinon.spy("emit");
			
//			var user = new UserImpl();
//			user.getMyId();
			
			//console.log("***");

			// These functions should have been created by your code, we can just call them:
			//dummySocket.onopen();
			//dummySocket.onmessage(JSON.stringify({ hello : 'from server' }));
			//console.log(dummySocket);

			// You can assert whether your code sent something to the server like this:
			//console.log(dummySocket.send);
			//sinon.assert.calledWith(dummySocket.send, 'my::id');
	
			ok(true);
		});
	};
		
	return {
		run: initialize
	};
});
