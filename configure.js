module.exports = {
    fb: {
        appId: '348309918582683'
      , appSecret: 'f213311810ca65e88de26db839ba21bb'
    },
    
    // Set global application locales.
    setLocales: function(app){
		app.locals({
		    site: {
        		title: 'InterestBoard',
		    }
		});
    
    }
};


