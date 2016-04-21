var nodemailer        = require('nodemailer');
var path              = require('path')
var mongoose = require('mongoose')
, Schema = mongoose.Schema;

var constants         = require('../scripts/constants');
var config            = require(path.join(constants.paths.config, '/config'));
var logger      			= require(constants.paths.scripts +  '/logger');
var weather			      = require(constants.paths.scripts +  '/weather');
var pathBuilder			  = require(constants.paths.scripts +  '/pathBuilder');
var groupService      = require(constants.paths.services +  '/groups');
var modelVisit        = require(constants.paths.models +  '/visit');

var smptOptions       = config.get("email.smtp-options");
var transporter       = nodemailer.createTransport(smptOptions);
var emailTemplate     = require('email-templates').EmailTemplate;

var email = {}

email.newUserAdd 								= newUserAdd;
email.notifyNewVisit 						= notifyNewVisit;
email.notifyVisitOwnerChange 		= notifyVisitOwnerChange;
email.welcomeClient 						= welcomeClient;
email.inviteAttendees 					= inviteAttendees;

module.exports = email;

  // send user registration notification
function newUserAdd(user) {
  if(config.get('email.send-mails')!="true") return;

  var templateDir = path.join(constants.paths.templates, 'email', 'register');
  var registerMail = new emailTemplate(templateDir);

  registerMail.render(user, function (err, results) {

    if(err){
      return console.log(err);
    }

    var emailId = user.email;

    var mailOptions = {
        from: config.get('email.from'),
        to: emailId, // list of receivers
        subject: 'User registration activation', // Subject line
        text: results.text, // plaintext body
        html: results.html // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info){
      if(error){
          return console.log(error);
      }
      console.log('Message sent: ' + info.response);

    });
  }); // end of register mail render
} // end of sendMailOnRegistration

function notifyNewVisit(visitId) {
	if(config.get('email.send-mails')!="true") return;

	var templateDir = path.join(constants.paths.templates, 'email', 'newVisit');
	var mailTemplate = new emailTemplate(templateDir);
	modelVisit
		.findOne({ _id: visitId })
		.populate('client')
		.populate('createBy')
		.populate('visitors.visitor')
		.exec(function (err, visit) {
			if(err) {
				console.log(err);
			}
			else{
				sendMail(visit)
			}
		})

		function sendMail(visit){
			mailTemplate.render(visit, function (err, results) {

				if(err){
					return console.log(err);
				}

				var emailIds = [];
				groupService.getUsersByGroup("vManager")
					.then(function(users){
						users.forEach(function(user){
							emailIds.push(user.email);
						});
						var mailOptions = {
								from: config.get('email.from'),
								to: emailIds, // list of receivers
								subject: 'New Visit Agenda Submitted', // Subject line
								text: results.text, // plaintext body
								html: results.html // html body
						};

						// send mail with defined transport object
						transporter.sendMail(mailOptions, function(error, info){
							if(error){
									return console.log(error);
							}
							console.log('Send mail:: New Visit Initiayted - Status: ' + info.response);
							console.log('Notifications sent to ' + emailIds);
						}); // end of transporter.sendMail

					}); // end of getUsersByGroup service call
			}); // end of register mail render
		} // end of sendmail
} // end of sendMailOnRegistration

function notifyVisitOwnerChange(visit) {
	console.log("sendMailOnNewVisit")
	console.log("send mail? " + config.get('email.send-mails'));
	if(config.get('email.send-mails')!="true") return;

	var templateDir = path.join(constants.paths.templates, 'email', 'newVisit');
	var mailTemplate = new emailTemplate(templateDir);

	mailTemplate.render(visit, function (err, results) {

		if(err){
			return console.log(err);
		}

		var emailIds = [];
		groupService.getUsersByGroup("vManager")
			.then(function(users){
				console.log("retrieved users");
				console.log(users);
				users.forEach(function(user){
					emailIds.push(user.email);
				});
				console.log('emails found')
				console.log(emailIds);
				var mailOptions = {
						from: config.get('email.from'),
						to: emailIds, // list of receivers
						subject: 'New Visit Agenda Submitted', // Subject line
						text: results.text, // plaintext body
						html: results.html // html body
				};

				console.log(mailOptions);

				// send mail with defined transport object
				transporter.sendMail(mailOptions, function(error, info){
					if(error){
							return console.log(error);
					}
					console.log('Message sent: ' + info.response);
				}); // end of transporter.sendMail

			}); // end of getUsersByGroup service call
	}); // end of register mail render
} // end of sendMailOnRegistration

function welcomeClient(visitId, basePath) {
	if(config.get('email.send-mails')!="true") return;

	var templateDir = path.join(constants.paths.templates, 'email', 'welcomeClient');
	var mailTemplate = new emailTemplate(templateDir);

	modelVisit
		.findOne({ _id: visitId })
		.populate('anchor')
		.populate('client')
		.populate('visitors.visitor')
		.exec(function (err, visit) {
			if(err) {
				console.log(err);
			}
			else{
				var weatherSch = weather.getWeatherForSchedule(visit.schedule);
				visit.visitors.forEach(function(participant){
					var visitor = {
						name: participant.visitor.name,
						email: participant.visitor.email,
						schedule: weatherSch,
						spoc: visit.anchor,
						hostPath: basePath,
						loginPath: pathBuilder.getPath(basePath, "loginPage")
					};

					mailTemplate.render(visitor, function (err, results) {

						if(err){
							return console.log(err);
						}

						var mailOptions = {
								from: config.get('email.from'),
								to: visitor.email, // list of receivers
								subject: 'Welcome to CSC', // Subject line
								text: results.text, // plaintext body
								html: results.html // html body
						};

						// send mail with defined transport object
						transporter.sendMail(mailOptions, function(error, info){
							if(error){
									return console.log(error);
							}
							console.log('Send Mail:: WelcomeClient ' + visitor.email + " -- Status: "+ info.response);
						}); // end of transporter.sendMail
					}); // end of register mail render
				}) // end of visitors loop
			} // end of model else
		}); // end of visit model
} // end of welcomeClient


function inviteAttendees(visitId, basePath){
	//ToDo:: To be implemented
}
