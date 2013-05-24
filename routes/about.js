module.exports = function(app, models, modules) {
	app.get('/about/:subpage', function (req, res) {
		if ('development' == app.get('env')) {
			console.log("Rendering about: "+ req.params.subpage);
		}
		res.render(''+ req.params.subpage,
	  		{ title : app.i18n.__(''+req.params.subpage) }
  		);

	});
}