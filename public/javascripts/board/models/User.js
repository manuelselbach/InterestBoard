define(['Backbone', 'BackboneSchema'], function(backbone, backboneschema, require)  {

	/**
	 * Representation of a Users
	 */
	var User = Backbone.Model.extend({

		// Default schema insure that a new user will have all necessary attributes
		defaults: function() {
			return {
				name: "",
				id: undefined,
				img: '/images/blank.png'
			};
		},
  		
  		validate: function(attrs, options){
  			var errors = [];
			
			if(!attrs) {attrs = this.attributes};
			if (!attrs.name || attrs.name == '') {
				console.log('A user without an name is not possible.');
				errors.push({name: 'User', message: 'A user without an name is not possible.'});
			}
			
			/**
			var val = this.validateS();
			if(val != true){
				errors.push({name: 'Schema', message: val});
			}
			*/
			
			return errors.length > 0 ? errors : undefined;
  		},
  		
  		// Demo method.
  		doSomething: function doSomething() {
      		console.log("hm, i should log this to console.");
    	}
	});

	return User;
});
