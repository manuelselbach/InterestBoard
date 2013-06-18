define(['Backbone', 'BackboneSchema'], function(backbone, backboneschema, require) {

	/**
	 * Representation of a Board
	 */
	var Board = backboneschema.extend({
		
		schema: {
			_id: { }
			, status: { type: String }
			, boardname: { type: String  }
			, title: { type: String }
			, tagline: { type: String }
			, added: {
				at: { type: Date },
				by: {
					fid:		{ type: Number },
					name:		{ type: String },
					img:		{ type: String }
				}
			},
			updated: { type: Date }
		}, 
  
		urlRoot: function url(){
			var board = location.href;
			var regex = /\/board\/([^#\\]+)/gim;
			var matches = regex.exec(board);
			return matches[1] +'/info.json';
		},

		eql: function(other) {
			console.log( this.get('url') +" == "+ other.get('url'));
    		return this.get('url') == other.get('url') &&
    			this._id == other.get('_id');
 		},
		
		initialize: function(){
		}
  		
  		
	});

	return Board;
});
