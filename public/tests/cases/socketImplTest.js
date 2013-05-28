
define(['QUnit', 'SocketImpl'], function(qunit, SocketImpl){
	
	var initialize = function initialize() {
		test_SocketImpl();
	};
	
	var test_SocketImpl = function(){
		console.log('.test_SocketImpl');
		
		module( "Module SocketSingelton-Test", {
			setup: function() {
				// run before
			},
			teardown: function() {
				// run after
			}
		});
		
		test( "Should be the same value to be sure this is a singleton", function(){
    		var ss1 = new SocketImpl();
    		ss1.setValue("set test string to the first instance")
    		var ss2 = new SocketImpl();
    		console.log(ss2);
    		ss2.einWert = "HALLO";
    		ss1.einWert = "DUDA";
    		equal( ss2.einWert,  ss1.einWert);
    		equal( ss2.getValue(),  "set test string to the first instance" );
    		ss2.setValue("set test string to the second instance")
    		equal( ss2.getValue(),  "set test string to the second instance" );
    		equal( ss1.getValue(),  "set test string to the second instance" );
		});
		
		
	};
		
	return {
		run: initialize
	};
});
