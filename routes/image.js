module.exports = function(app, models, modules) {

	var fs 			= require('fs')
	;

	app.get('/image/', function (req, res) {
		res.writeHead(200, { 'Content-Type': 'image/png' });
		fs.readFile('./public/images/blank.png', function (err, data) {
			res.write(data);  
        	res.end();  
		});
	});
	
	app.get('/image/:identifier', function (req, res) {
		if ('development' == app.get('env')) {
			console.log("Rendering image: "+ req.params.identifier);
		}
		// streaming image.
		res.writeHead(200, { 'Content-Type': 'image/png' });
		var readstream = app.gridfs.createReadStream({	
				filename: req.params.identifier,
				mode: 'r',
				root: 'ScreenShots',
			} );
			
		readstream.on('error', function (err) {
			console.log("Ey, some error.", err);
			// todo
			// find post
			// delete image
			// rerender
		});
		
		readstream.pipe(res);

	});
	
}