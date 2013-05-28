define(function(){
	var __instance;
 	
	var SingletonAbstract = function() {
		var value;

		if ( SingletonAbstract.prototype.__instance ) {
			return SingletonAbstract.prototype.__instance;
		}
		
		SingletonAbstract.prototype.__instance = this;

	};

	$.extend(SingletonAbstract.prototype, {
 		setValue: function(value){
 			this.value = value;
 		},
 		getValue: function(){
 			return this.value;
 		}
 	});
	return SingletonAbstract;
});