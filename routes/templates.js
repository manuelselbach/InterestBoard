module.exports = function(app, models, modules) {
	app.get('/templates/:folder?/(:file)(.html)?', function (req, res) {
		if ('development' == app.get('env')) {
			console.log("Rendering template: "+ req.params.folder +", "+ req.params.file);
		}
		var path = '';
		if( req.params.folder ) path +=  req.params.folder +'/';
		path += req.params.file;
		res.render('client/'+ path,
	  		{ }
  		);

	});
}