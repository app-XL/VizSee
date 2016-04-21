var express 					= require('express');
var router 						= express.Router();
var constants					= require('../scripts/constants');

var apps 							= require(constants.paths.controllers + '/api/application');
var auth 							= require(constants.paths.controllers + '/api/auth');
var users 						= require(constants.paths.controllers + '/api/users');
var keynotes 					= require(constants.paths.controllers + '/api/keynotes');
var clients 					= require(constants.paths.controllers + '/api/clients');
var csclocations 			= require(constants.paths.controllers + '/api/csclocations');
var visits 						= require(constants.paths.controllers + '/api/visits');
var visitSchedule 		= require(constants.paths.controllers + '/api/visitSchedules');
var feedbackDef 			= require(constants.paths.controllers + '/api/feedbackDefs');
var fileupload						= require(constants.paths.controllers + '/api/fileupload');
var facts 					= require(constants.paths.controllers + '/api/facts');

var lov 					= require(constants.paths.controllers + '/api/lov');
var groups					= require(constants.paths.controllers + '/api/groups');

var cityFacts				= require(constants.paths.controllers + '/api/cityFacts');
var factSheets				=	require(constants.paths.controllers + '/api/factSheets');
var teasers					=	require(constants.paths.controllers + '/api/teasers');
var contactList			=	require(constants.paths.controllers + '/api/contactList');
var feedbacks				=	require(constants.paths.controllers + '/api/feedbacks');
var emails					=	require(constants.paths.controllers + '/api/emails');

/*
 * Routes that can be accessed by any one
 */
router.post('/api/v1/login', auth.login);
router.get('/api/v1/app/info', apps.info);

/*
 * Routes that can be accessed only by authenticated & authorized users
 */
router.get('/api/v1/secure/admin/users', users.getAll);
router.get('/api/v1/secure/admin/users/:id', users.getOneById);
router.post('/api/v1/secure/admin/users/', users.create);
router.put('/api/v1/secure/admin/users/:id', users.updateById);
router.delete('/api/v1/secure/admin/users/:id', users.deleteById);
router.get('/api/v1/secure/admin/users/email/:email', users.getByEmail);

//Route for file upload
//router.post('/api/v1/upload',fileupload.create);
router.post('/api/v1/upload/:entity',fileupload.create);
router.post('/api/v1/multiupload/:entity',fileupload.create);

// List of service routes for KeyNotes
router.get('/api/v1/secure/keynotes', keynotes.getAll);
router.get('/api/v1/secure/keynotes/id/:id', keynotes.getOneById);
router.post('/api/v1/secure/keynotes', keynotes.create);
router.put('/api/v1/secure/keynotes/:id', keynotes.updateById);
router.delete('/api/v1/secure/keynotes/:id', keynotes.deleteById);
router.get('/api/v1/secure/keynotes/find', keynotes.getWithQuery);

// List of service routes for clients
router.get('/api/v1/secure/clients', clients.getAll);
router.get('/api/v1/secure/clients/id/:id', clients.getOneById);
router.post('/api/v1/secure/clients', clients.create);
router.put('/api/v1/secure/clients/id/:id', clients.updateById);
router.delete('/api/v1/secure/clients/:id', clients.deleteById);
router.get('/api/v1/secure/clients/find', clients.getWithQuery);


// List of service routes for lov
router.get('/api/v1/secure/lov', lov.getAll);
router.get('/api/v1/secure/lov/:name', lov.getOneByName);
router.post('/api/v1/secure/lov', lov.create);
router.put('/api/v1/secure/lov/:name', lov.updateByName);
router.delete('/api/v1/secure/lov/:name', lov.deleteByName);

// List of service routes for facts
router.get('/api/v1/secure/facts', facts.getAll);
router.get('/api/v1/secure/facts/:id', facts.getOneById);
router.post('/api/v1/secure/facts', facts.create);
router.put('/api/v1/secure/facts/:id', facts.updateById);
router.delete('/api/v1/secure/facts/:id', facts.deleteById);

// List of service routes for csclocations
router.get('/api/v1/secure/csclocations', csclocations.getAll);
router.get('/api/v1/secure/csclocations/:id', csclocations.getOneById);
router.post('/api/v1/secure/csclocations', csclocations.create);
router.put('/api/v1/secure/csclocations/:id', csclocations.updateById);
router.delete('/api/v1/secure/csclocations/:id', csclocations.deleteById);

// List of service routes for visits
router.get('/api/v1/secure/visits', visits.getAll);
router.get('/api/v1/secure/visits/:id', visits.getOneById);

//router.get('/api/v1/secure/visits/:id/sessions', visits.getSessionsById);
router.get('/api/v1/secure/visits/:id/:action', visits.getWithAction);
// router.get('/api/v1/secure/visits/:id/sessions', visits.getSessionsById);
// router.get('/api/v1/secure/visits/:id/execs', visits.getExecsById);
router.post('/api/v1/secure/visits', visits.create);
router.put('/api/v1/secure/visits/:id', visits.updateById);
router.delete('/api/v1/secure/visits/:id', visits.deleteById);

// List of service routes for visitSchedules
router.get('/api/v1/secure/visitSchedules', visitSchedule.getAll);
router.get('/api/v1/secure/visitSchedules/:id', visitSchedule.getOneById);
router.get('/api/v1/secure/visitSchedules/visit/:id', visitSchedule.getAllByVisitId);
router.post('/api/v1/secure/visitSchedules', visitSchedule.create);
router.put('/api/v1/secure/visitSchedules/:id', visitSchedule.updateById);
router.delete('/api/v1/secure/visitSchedules/:id', visitSchedule.deleteById);

// List of service routes for feedbackDefs
router.get('/api/v1/secure/feedbackDefs', feedbackDef.getAll);
router.get('/api/v1/secure/feedbackDefs/id/:id', feedbackDef.getOneById);
router.post('/api/v1/secure/feedbackDefs', feedbackDef.create);
router.put('/api/v1/secure/feedbackDefs/:id', feedbackDef.updateById);
router.delete('/api/v1/secure/feedbackDefs/:id', feedbackDef.deleteById);
router.get('/api/v1/secure/feedbackDefs/find', feedbackDef.getWithQuery);

//list of service routes for cityFacts
router.get('/api/v1/secure/cityFacts', cityFacts.getAll);
router.get('/api/v1/secure/cityFacts/:id', cityFacts.getOneById);
router.post('/api/v1/secure/cityFacts', cityFacts.create);
router.put('/api/v1/secure/cityFacts/:id', cityFacts.updateById);
router.delete('/api/v1/secure/cityFacts/:id', cityFacts.deleteById);


//list of service routes for factSheets
router.get('/api/v1/secure/factSheets', factSheets.getAll);
router.get('/api/v1/secure/factSheets/:id', factSheets.getOneById);
router.post('/api/v1/secure/factSheets', factSheets.create);
router.put('/api/v1/secure/factSheets/:id', factSheets.updateById);
router.delete('/api/v1/secure/factSheets/:id', factSheets.deleteById);

//list of service routes for teasers
router.get('/api/v1/secure/teasers', teasers.getAll);
router.get('/api/v1/secure/teasers/:id', teasers.getOneById);
router.post('/api/v1/secure/teasers', teasers.create);
router.put('/api/v1/secure/teasers/:id', teasers.updateById);
router.delete('/api/v1/secure/teasers/:id', teasers.deleteById);

//list of service routes for contactList
router.get('/api/v1/secure/contactList', contactList.getAll);
router.get('/api/v1/secure/contactList/:id', contactList.getOneById);
router.post('/api/v1/secure/contactList', contactList.create);
router.put('/api/v1/secure/contactList/:id', contactList.updateById);
router.delete('/api/v1/secure/contactList/:id', contactList.deleteById);
router.get('/api/v1/secure/contactList/city/:location', contactList.getWithCity);

// List of service routes for groups
router.get('/api/v1/secure/admin/groups', groups.getAll);
router.get('/api/v1/secure/admin/groups/:id', groups.getOneById);
router.post('/api/v1/secure/admin/groups', groups.create);
router.put('/api/v1/secure/admin/groups/:id', groups.updateById);
router.delete('/api/v1/secure/admin/groups/:id', groups.deleteById);
router.get('/api/v1/secure/admin/groups/:name/users', groups.getUsersByGroup);

// List of service routes for feedbacks
router.get('/api/v1/secure/feedbacks', feedbacks.getAll);
router.get('/api/v1/secure/feedbacks/:id', feedbacks.getOneById);
router.post('/api/v1/secure/feedbacks', feedbacks.create);
router.put('/api/v1/secure/feedbacks/:id', feedbacks.updateById);
router.delete('/api/v1/secure/feedbacks/:id', feedbacks.deleteById);

router.get('/api/v1/secure/email/:id/:action', emails.sendMails);

module.exports = router;
