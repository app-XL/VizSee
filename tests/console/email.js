
console.log("cViz Testing Script - email notifications");
console.log();

var mongoose = require('mongoose');

var constants       = require('../../scripts/constants');
var util						= require(constants.paths.scripts + "/util");
var logger					= require(constants.paths.scripts + "/logger");
var secure					= require(constants.paths.scripts + "/secure");
var emailController					= require(constants.paths.scripts + "/email");
var userService           = require(constants.paths.services +  '/users');
var visitService           = require(constants.paths.services +  '/visits');

require(constants.paths.scripts + '/database'); // load database management scripts
var emails = [];

var visitId = "a01234567892345678900004";
console.log("Running with visit id " + visitId);
try{
	emailController.welcomeClient(visitId, 'http://localhost:8080');
}
catch(err){
	console.log(err);
}
