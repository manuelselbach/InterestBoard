var _ = require('underscore');

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
			at: {
				type: Date, 
				default: Date.now },
			},
			by: {
				fid:		{ type: Number },
				name:		{ type: String },
				img:		{ type: String }
			},
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

	/**
	 * Find boards by regular expressen on its name, title or tagline
	 */
	var findByString = function(searchStr, callback) {
		app.log.debug("# Board: find by String '%s'", searchStr);
		var searchRegex = new RegExp(searchStr, 'i');
		Board.find({
			$or: [
				{ boardname:{ $regex: searchRegex } },
				{ title: 	{ $regex: searchRegex } },
				{ tagline:  { $regex: searchRegex } }
			]
		}, callback);
	};

	/**
	 * Get a board by its id
	 */
	var findById = function(boardId, callback) {
		app.log.debug("# Board: find by Id '%d'", boardId);
		Board.findOne({_id:boardId}, function(err,doc) {
			callback(doc);
		});
	};

	/**
	 * Get a board by name and aggegated the posts into a post count.
	 */
	var findByName = function(boardName, callback) {
		app.log.debug("# Board: find by name '%s'", boardName);	
		Board.aggregate(
			{ $match: { boardname: boardName }}
			,{ $unwind : "$posts" }
			,{ $group : {
				_id : { 
					_id: "$_id",
					status: "$status",
					boardname: '$boardname',
					title: "$title",
					tagline: "$tagline",
					added: "$added",
					updated: "$updated"
				},
				postsize : { $sum : 1 }
			}}
			, function (err, result) {
				if(err) app.log.error("Can not get board by name '%s', because: %s", boardName, err);
				var doc;
				if(result && result.length > 0){
					doc = result[0];
				}
				if(result && result.length > 1){
					app.log.error("More than one board is using the name '%s'", boardname);
				}
				// doc.postsize = {postsize: doc.postsize};
				//var resDoc = _.flatten(doc, true);
				doc._id.postsize = doc.postsize;
				var resDoc = _.flatten(doc, true);
				resDoc = doc._id;
				callback(resDoc);
		});
	};

	/**
	 * Get a board and its posts by name
	 */
	var findByNameWithPosts = function(boardName, callback) {
		app.log.debug("# Board: find by name with posts '%s'", boardName);
		Board.findOne({boardname:boardName}, function(err,doc) {
			callback(doc);
		});
	};

	/**
	 * Create a new board
	 */
	var create = function(bname, title, user, createCallback) {
		app.log.info("Create a new board called '%s'", bname);
		var board = new Board({
			boardname: ""+ bname,
			title: title,
			tagline: "",
			added: {
				at: new Date(),
				by: { 
					fid: user.id,
					name: user.name,
					img: user.picture.url
				}
			},
			updated: new Date()
		});
		board.save(createCallback);
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
		app.log.info("Add user '%s' to board '%s'", user.name, bname);
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

	/**
	 * Removes a user object from the board by boardname
	 *
	 * If a user left the board, it should ungegisterd from the roaster.
	 */
	var removeUserFromBoard = function(bname, user, callback){
		app.log.info("Remove user '%s' from board '%s'", user.name, bname);
		Board.update(
			{ boardname: bname }, 
			{ '$pull': { currentusers: { fid: user.fid } } }
			, callback
		);
	};
	
	/**
	 * This function removes all active users from all boards.
	 *
	 * Call this at application startup to clear the pending users
	 */
	var removeAllActiveUsersFromAllBoards = function(callback){
		app.log.debug("# Remove all users from all boards" );
		Board.update(
			{ } 
			, {'currentusers': [] } //{ '$pull': { currentusers: {} } }
			, {'multi': 1 }
			, callback
		);
	};
	
	/**
	 * Add a new post object to the board by boardname
	 */
	var addPost = function(board, post, callback){
		app.log.info("Add a new post with title '%s' to board '%s'.", post.title, board.name);
		app.log.debug(post);
		var resultingPostNr = board.posts.push(post);
		board.save(function onSave(err, board){
			var savedPost = board.posts;
			callback(err, savedPost[resultingPostNr -1]);			
		});	
	};
	
	/**
	 * Add a new post object to the board
	 */
	var removePost = function(board, postid, callback){
		app.log.info("Remove post with id '%d' from board '%s'", postid, board.title);
		board.posts.pull(postid);
		board.save(function onSave(err, board){
			callback(err);
		});	
	};
	
	/**
	 * Return the posts in opposite order
	 */
	var findSortedPostsByBoardName = function(boardname, callback){
		app.log.debug("# Find sorted posts by board name '%s'", boardname);
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
		findByNameWithPosts: findByNameWithPosts,	
    	create: create,
	    addUserToBoard: addUserToBoard,
	    addPost: addPost,
	    removePost: removePost,
		removeUserFromBoard: removeUserFromBoard,
		removeAllActiveUsersFromAllBoards: removeAllActiveUsersFromAllBoards,
		findSortedPostsByBoardName: findSortedPostsByBoardName,
		UserSchema: UserSchema,
		Board: Board
	};
}