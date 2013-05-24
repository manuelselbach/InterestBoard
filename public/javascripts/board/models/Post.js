define(['Backbone', 'BackboneSchema'], function(backbone, backboneschema, require) {

	/**
	 * Representation of a Post
	 */
	var Post = backboneschema.extend({
		
		schema: {
			url: { type: String }
			, img: { type: String  }
			, text: { type: String }
			, title: { type: String }
			, _isStrict: true
		}, 
  
		urlRoot: function url(){
			var board = location.href;
			var regex = /\/board\/([^#\\]+)/gim;
			var matches = regex.exec(board);
			return matches[1] +'/post';
		},

		isRemovable: false,
		
		// Default schema insure that a new user will have all necessary attributes
		defaults: function() {
			return {
				url: '',
				img: '',
				text: '',
				title: '',
			};
		},
		
		eql: function(other) {
			console.log( this.get('url') +" == "+ other.get('url'));
    		return this.get('url') == other.get('url');
 		},
		
		validate: function (attrs, options) {
			var errors = [];
			
			if(!attrs) {attrs = this.attributes};
			if (!attrs.url || attrs.url == '') {
				console.log('A post without an url is not possible.');
				errors.push({name: 'Form', message: 'A post without an url is not possible.'});
			}
			
			var val = this.validateS();
			
			if(val != true){
				errors.push({name: 'Schema', message: val});
			}
			
			return errors.length > 0 ? errors : undefined;
		},
		
		initialize: function(){

		}
  		
  		
	});

	return Post;
});
