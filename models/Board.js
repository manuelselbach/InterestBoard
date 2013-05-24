module.exports = function(app, mongoose) {

	var schemaOptions = {
		toJSON: {
			virtuals: true	
		},
		toObject: {
			virtuals: true
		}
	};

	/**
		Facebook user:
		---------------
		{ id: '1805383408',
		  name: 'Peter Shaw',
		  link: 'http://www.facebook.com/PeterDunstonShaw',
		  username: 'PeterDunstonShaw',
		  about: 'http://unthoughted.wordpress.com',
		  hometown: { id: '115823945095170', name: 'Offenbach, Hessen' },
		  location: { id: '110221372332205', name: 'Frankfurt, Germany' },
		  bio: 'Feiersüchtiger Erdlig mit Fetisch für goldige Marotten.',
		  quotes: '"Panama riecht von oben bis unten nach Bananen." sagte der kleine Bär.',
		  gender: 'male',
		  picture: 
		   { data: 
		      { url: 'https://fbcdn-profile-a.akamaihd.net/hprofile-ak-prn1/49852_1805383408_5205_q.jpg',
		        is_silhouette: false } } }
	*/

	var UserDefinition = {
		sid:		{ type: String },
		fid:		{ type: Number },
		name:		{ type: String },
		img:		{ type: String },
		hometown:	{
			fid:	{ type: Number },
			name:	{ type: String }
		},
		location:	{
			fid:	{ type: Number },
			name:	{ type: String }
		},
		updated:	{ type: Date }
	};
	
	var UserSchema = new mongoose.Schema(UserDefinition, schemaOptions );
	//UserSchema.path('sid').index({ unique: true });
	
	UserSchema.index({ 
		sid: 1,
		fid: 1
	});
	
	var PostSchema = new mongoose.Schema({
		url:		{ type: String },
		title:		{ type: String },
		img:		{ type: String },
		text:		{ type: String },
		author:		UserDefinition,
		added:		{ 
			type: Date, 
			default: Date.now },
		rendered:   { type: Boolean },
	}, schemaOptions );
  
	var BoardSchema = new mongoose.Schema({
		status:		{ type: String },
		boardname:	{ 
			type: String, 
			lowercase: true, 
			trim: true },
		title:		{ 
			type: String, 
			trim: true, 
			unique: true },
		tagline:	{ type: String },
		added:		{ 
			type: Date, 
			default: Date.now },
		updated:	{ 
			type: Date, 
			default: Date.now },
		currentusers:	[UserSchema],
		posts:			[PostSchema]
	}, schemaOptions );
	
	BoardSchema.index({
		boardname: 1
	});
  
	var Board = app.dbconnection.model('Board', BoardSchema);

	// rember, there are virtuals around. but i do not need it, yet.
	// personSchema.virtual('name.full').get(function () {
	// return this.name.first + ' ' + this.name.last;
	// });

	var findByString = function(searchStr, callback) {
		var searchRegex = new RegExp(searchStr, 'i');
		Board.find({
			$or: [
				{ boardname:{ $regex: searchRegex } },
				{ title: 	{ $regex: searchRegex } },
				{ tagline:  { $regex: searchRegex } }
			]
		}, callback);
	};

	var findById = function(boardId, callback) {
		Board.findOne({_id:boardId}, function(err,doc) {
			callback(doc);
		});
	};

	var findByName = function(boardName, callback) {
		Board.findOne({boardname:boardName}, function(err,doc) {
			callback(doc);
		});
	};

	var create = function(bname, title, createCallback) {
		if ('development' == app.get('env')) console.log('Create board ' + bname);
		var board = new Board({
			boardname: ""+ bname,
			title: title,
			tagline: "",
			added: new Date(),
			updated: new Date()
		});
		board.save(createCallback);
		if ('development' == app.get('env')) console.log('Save command was sent');
	};
	
  	/**
  	 * Adds a user object to a board by boardname
  	 * 
  	 * The user in the board indicates the currently active users. Initialy the 
  	 * client gets a full list off all active users.
  	 * The callback will called after the update is invoked. Pass an error-variable
  	 * to the callback callback(err); If teh update works fine, than err is undefined.
  	 */
	var addUserToBoard = function(bname, user, callback){
		if ('development' == app.get('env')) console.log('Add user to board '+ bname +', '+ user.name);
		Board.find({ 'boardname': bname })
		.where('currentusers.sid').equals(user.sid)
		.select('boardname name currentusers')
		.limit(1)	// one is enough, why select all and check on zero.. 
		.exec(function(err, b){	
				if(err) callback("There is an error checking the current online users");
				if(b.length == 0){
					Board.update({ boardname: bname }, {$push: {currentusers:  user }}, callback);
				} else {
					callback("User is still registerd to this board");
				}
		});
	};
  
	var removeUserFromBoard = function(bname, user, callback){
		if ('development' == app.get('env')) console.log("Remove "+ bname +","+ user.sid );
		Board.update(
			{ boardname: bname }, 
			{ '$pull': { currentusers: { sid: user.sid } } }
			, callback
		);
	};
	
	var removeAllActiveUsersFromAllBoards = function(callback){
		if ('development' == app.get('env')) console.log("Remove all users from all boards" );
		Board.update(
			{ } 
			, {'currentusers': [] } //{ '$pull': { currentusers: {} } }
			, {'multi': 1 }
			, callback
		);
	};
	
	var addPost = function(board, post, callback){
		if ('development' == app.get('env')) {
			console.log("# Add post");
			console.log(post);
		}
		board.posts.push(post);
		board.save(function onSave(err, board){
			callback(err);
			
		});	
	};
	
	var findSortedPostsByBoardName = function(boardname, callback){
		Board.aggregate(
			{ $match: { boardname: boardname }}
			, { $project: { 
				'_id': 0,
				'posts._id': 1,
				'posts.url': 1,
				'posts.title': 1,
				'posts.img': 1,
				'posts.text': 1,
				'posts.author': 1,
				'posts.added': 1,
				'posts.rendered': 1
			}}, { $unwind : "$posts" }
			, { $sort : { "posts.added": -1 } }
			, function (err, result) {
				if (err) console.log("ERROR:"+ err);
				var postresult = {};
				postresult.posts = [];
				result.map(function(data){
					if( data.posts.rendered ){
						var thispost = {
							_id: data.posts._id,
							title: data.posts.title,
							rendered:  data.posts.rendered,
							url: data.posts.url, 
							img: data.posts.img,
							text: data.posts.text,
							author: data.posts.author
						};	
						postresult.posts.push( thispost );
					}
				});

				callback(postresult.posts);
			});
	};
		
	return {
		findById: findById,
		findByString: findByString,
		findByName: findByName,
    	create: create,
	    addUserToBoard: addUserToBoard,
	    addPost: addPost,
		removeUserFromBoard: removeUserFromBoard,
		removeAllActiveUsersFromAllBoards: removeAllActiveUsersFromAllBoards,
		findSortedPostsByBoardName: findSortedPostsByBoardName,
		UserSchema: UserSchema,
		Board: Board
	};
}