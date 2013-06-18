
define(['QUnit', 'SingletonAbstract'], function(qunit, Singelton){
	
	var initialize = function initialize() {
		test_Singelton();
	};
	
	var test_Singelton = function(){
		console.log('.test_socketSingelton');
		
		module( "Module SocketSingelton-Test", {
			setup: function() {
				// run before
			},
			teardown: function() {
				// run after
			}
		});
		
		test( "Create a single instance and get value back", function(){
    		var ss = new Singelton();
    		ss.setValue("A String to test the private property");
    		equal( ss.getValue(),  "A String to test the private property" );
		});
		
		test( "Should not overwrite the singelton varaible from outside", function(){
    		var ss = new Singelton();
    		ss.setValue("A String to test the private property");
    		Singelton.value = "Another bad string";
    		equal( ss.getValue(),  "A String to test the private property" );
		});
		
		test( "Should be the same document", function(){
    		var ss1 = new Singelton();
    		ss1.setValue("set test string to the first instance")
    		var ss2 = new Singelton();
    		ss2.setValue("set test string to the second instance")
    		deepEqual( ss1,  ss2 );
		});

		test( "Should be the same value", function(){
    		var ss1 = new Singelton();
    		ss1.setValue("set test string to the first instance")
    		var ss2 = new Singelton();
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
