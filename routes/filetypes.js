module.exports = function(app, models, modules) {
	app.get('*.json', function(req, res, next) {
  		res.contentType('application/json');
		next();
	});
};