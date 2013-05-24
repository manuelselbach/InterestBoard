module.exports = function(app, models) {

	/** 
	 * Removes all active users from all boards
	 */
	this.clearAllUsersFromBoard = function() {
		//if ('development' == app.get('env')) 
		console.log("Clear all users from all boards");
		if(models.Board){
			models.Board.removeAllActiveUsersFromAllBoards();
		}
	}
	
	/**
	 * Initial call to remove all users at startup
	 */
	this.clearAllUsersFromBoard();

};