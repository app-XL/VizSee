'use strict';

var constants         = require('../../scripts/constants');
var logger			     	= require(constants.paths.scripts + '/logger');
var emailService     	= require(constants.paths.scripts + '/email');

var controller = {}

controller.sendMails     = sendMails;

module.exports = controller;

function sendMails(req, res){
	logger.dump('debug',0, "api send mails", req.params.id, req.params.action);
	var basePath = 'http://' + req.headers.host ;

	switch(req.params.action.toLowerCase())
	{
    case "newvisit":
      emailService.notifyNewVisit(req.params.id);
      break;

		case "visitownerchange":
			emailService.notifyVisitOwnerChange(req.params.id);
			break;

		case "welcomeclient":
			emailService.welcomeClient(req.params.id, basePath);
			break;

		case "inviteAttendees":
			emailService.inviteAttendees(req.params.id, basePath);
			break;

		case "newuser":
			emailService.newUserAdd(req.params.id, basePath);
			break;

		default:
			res.status(404).send("Action could not be identified");
	}

	res.status(200).send("email notification initiated");
}
