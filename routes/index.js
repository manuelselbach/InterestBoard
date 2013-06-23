module.exports = function(app, models, modules) {
	app.get('/', function (req, res) {
		if ('development' == app.get('env')) {
			console.log("Rendering index.");
		}
		res.render('index',
	  		{ title : 'Home' }
  		);

	});
}