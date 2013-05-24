/**
 * Renders a post.
 * URL -> Image
 * 
 */
 module.exports = function(app, models) {
	 
	var   webshot 	= require('webshot')
		, fs 		= require('fs')
	 	, crypto 	= require('crypto')
	 	, request 	= require("request")
	 	, extrator 	= require("html-extractor")
	 	;
	 	
	// After a Post is inserted it should be render. This includes the process of taking 
	// a screenshot and scraping the url. 
	var shouldRender = function shouldRender(post, callback){
		if ('development' == app.get('env')){
			 console.log('# Rendering Post');
			 console.log( post );
		}
		
		
		// get the content
		request({
			uri: post.url,
		}, function(error, response, body) {
			pageExtrator = new extrator();
			pageExtrator.extract(body, function( err, data ){
				
				if(err){
					console.log("There is an error extraction the page from content: "+ post.url );
					return;
				}
									
				if(post.title == undefined || post.title == ''){
					post.title =  data.meta.title;
				}
						
				if(post.text == undefined || post.text == ''){
					post.text =  data.body.substring(0, 300) +'\n\n'+ 
						data.body.substring(0, 300); 
				};
				
				// Screenshot
				if(post.img == undefined || post.img == ''){
					var md5sum = crypto.createHash('md5').update(post.url).digest("hex");
					webshot(post.url, function(err, renderStream) {
						var writestream = app.gridfs.createWriteStream({
    						filename: md5sum,
    						mode: 'w',
    						content_type: 'image/png', 
    						root: 'ScreenShots',
    						metadata: {
								'a_metadata_key': 'none'
							}
						});
						renderStream.pipe(writestream);
					});
					post.img = md5sum;
				}
				
				// get back.
				post.rendered = true;
				callback(post);
			});
		});
	};
	
	// Registert events
	app.eventEmitter.on('post::shouldRender', shouldRender);
	
};
