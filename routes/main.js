var express 			= require('express');
var colors 				= require('colors');
var constants 		= require('../scripts/constants.js');
var appInfoServ   = require(constants.paths.services + '/appService');

module.exports = function(app, passport) {

	app.use(function (req, res, next) {
	  //console.log('Req @ Time:', Date.now());

    res.locals={
      appTitle: "mSkeleton",
      pageTitle: "main",
      author: "Sankar Vema",
      description: "Reusable MEAN stack template with MicroService architecture patterns",
      user: req.user,
      app_info: appInfoServ.info()
  	};

	  next();
	});

	app.all('/*', function(req, res, next) {
	  // CORS headers
	  res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
	  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
	  // Set custom headers for CORS
	  res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key');
	  if (req.method == 'OPTIONS') {
	    res.status(200).end();
	  } else {
	    next();
	  }
	});

	// Auth Middleware - This will check if the token is valid
	// Only the requests that start with /api/v1/* will be checked for the token.
	// Any URL's that do not follow the below pattern would be avoided

	// ToDo:: Api security supressed for dev - to be activated later
	//app.all('/api/v1/secure/*', [require(constants.paths.routes + '/validateRequest')]);

	// include routes here
	app.use('/', require('./apiRoutes')); // load api endpoint routes
	require('./authRoutes.js')(app, passport); // load authentication routes, fully configured with passport
	require('./pageRoutes.js')(app);
	require('./mobileRoutes.js')(app);
	//ToDo:: Tighten security for public assets
	app.use('/public', express.static('public')); // folder to render public assets. Can be improved for security tightening
	app.use('/app', express.static('public/app'));
	app.use('/profile', express.static('profile'));//folder to render user profile assets.
	// If no route is matched by now, it must be a 404
	app.use(function(req, res, next) {
	  var err = new Error('Not Found');
	  err.status = 404;
	  next(err);
	});

	// include error handler
	//require(constants.paths.scripts + '/err')(app);
}
