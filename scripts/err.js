var constants = require('./constants');
var config = require(constants.paths.config + '/config');

var errors = {
  404: {
    'internal': {
      'message': '404 - Dev error - Page not found',
      'stackTrace': true,
      'help': 'Check application log for detailed information'
    },
    'external': {
      'message': '404 - Dev error',
      'stackTrace': false,
      'help': 'Please contact your administrator for further help'
    }
  },
  500: {
    'internal': {
      'message': '500 - Internal error',
      'stackTrace': true,
      'help': 'Check application log for detailed information'
    },
    'external': {
      'message': 'Something went wrong with application',
      'stackTrace': false,
      'help': 'Please contact your administrator for further help'
    }
  }
}

// Error handling middletier
module.exports = function(app, passport) {
  app.use(logErrors);
  //app.use(clientErrorHandler);
  //app.use(catchRestAll);
}


function logErrors(err, req, res, next) {
  console.log('log error working');
  console.error(err.stack);
  next(err);
}


function clientErrorHandler(err, req, res, next) {
  console.log('clientErrorHandler working');
  if (req.xhr) {
    console.log('req.xhr');
    res.status(500).send({ error: 'Something failed!' });
  } else {
    next(err);
  }
}

function catchRestAll(err, req, res, next) {

  var error = {}
  
  if (config.get("env") === 'development') {
    error = {
      env: config.get("env"),
      err: err,
      status:err.status,
      message: errors[err.status].internal.message,
      help : errors[err.status].internal.help,
      trace: (errors[err.status].internal.stackTrace)? err.stack.split('\n'): 'Not available',
    }
  } else {
    error = {
      env: config.get("env"),
      err: err,
      status: err.status,
      message: errors[err.status].external.message,
      help : errors[err.status].external.help,
      trace: (errors[err.status].external.stackTrace)? err.stack.split('\n'): 'Not available',
    }
  }

  if(req.url.indexOf('api')>-1) // it is an api call
  {
    res.status(500).send(error); 
  } else {
      res.render('err.ejs', {
      err : error
    });
  }
}
