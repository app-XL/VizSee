'use strict';

var Q               = require('q');
var _								= require('underscore');
var mongoose = require('mongoose')
, Schema = mongoose.Schema;
var moment 					= require('moment');  require('moment-range');
var constants       = require('../scripts/constants');
var util						= require(constants.paths.scripts + "/util");
var logger						= require(constants.paths.scripts + "/logger");
var secure						= require(constants.paths.scripts + "/secure");
var model           = require(constants.paths.models +  '/visit');
var scheduleModel   = require(constants.paths.models +  '/visitSchedule');
var clientModel           = require(constants.paths.models +  '/client');
var userModel           = require(constants.paths.models +  '/user');
var executivesModel		= require(constants.paths.models + '/executives');
var regionsModel		= require(constants.paths.models + '/regions');
var commentsModel 		= require(constants.paths.models + '/comments');

// Service method definition -- Begin
var service = {};

service.getAll = getAll;
service.create = create;

service.getOneById = getOneById;
service.getSessionsById = getSessionsById;
service.getSchedulesById = getSchedulesById;
service.updateById = updateById;
service.deleteById = deleteById;

service.getMyVisits = getMyVisits;
service.getKeynotesById = getKeynotesById;
service.getParticipantsById = getParticipantsById;
service.getParticipantsByIdOrdering = getParticipantsByIdOrdering;

service.pushSession = pushSession;
service.updateSessions = updateSessions;
service.getLocationsById = getLocationsById;
service.getvalidationById = getvalidationById;

service.getVisitStats = getVisitStats;
service.getLastTimeSessionsById = getLastTimeSessionsById;
service.getAllSessionsById = getAllSessionsById;
service.getPDFSessionsById = getPDFSessionsById;
service.getOfferingsHeads = getOfferingsHeads;
service.getRegionsHeads = getRegionsHeads;
service.getParticipantsForOverAllFeedback = getParticipantsForOverAllFeedback;
service.getCount = getCount;

module.exports = service;

function getAll(){
	var deferred = Q.defer();

	model.find(function(err, list){
		if(err) {
			console.log(err);
			deferred.reject(err);
		}
		else
			deferred.resolve(list);
	});

	return deferred.promise;
} // getAll method ends

/*function getAll(page,perPage,sort,query,fields){

	// console.log("--------- in getAll of service  page,perPage,sort,query,fields = ", page,perPage,sort,query,fields)
    var deferred = Q.defer();
    var header = [];
    header.push({
        'start' : page,
        'size' : perPage,
        'filter' : query,
        'sort' : sort,
        'fields' : fields
    })
    model
    .find(query)
    .populate('client')
    .limit(perPage)
    .skip(perPage*page)
    .sort(sort)
    .select(fields)
    .exec(function(err, list){
        if(err) {
            console.log(err);
            deferred.reject(err);
        }
        else
            deferred.resolve(list);
    });

    return deferred.promise;
} // getAll method ends*/

// Method implementations
//ToDo:: Fix Known issues
// 2. Date are not as per UTC, timezone is effecting the date filters , limit){ , limit);
// 3. Custo9mers are not filtered by visit. They can access any visit of the client irrective of being part of it

function getMyVisits(thisUser, timeline, limit, page, perPage, sort, query, fields){

	// console.log("----------- in getMyVisits service ", limit, page, perPage, sort, query, fields)

	var deferred = Q.defer();

	// massage params
	if (timeline=="" || timeline===undefined)
		timeline = "all";

	// by default filter not applicable for "vManager, exec"
	var filter = {};
	var drafts_filter = {};
	var user_filter = {};
	var userId = thisUser._id;
	var userSessions = "";

	getUserSessions(userId)
	.then(function(data){
		userSessions = data;

		var projected = _(userSessions).chain().flatten().pluck('visit').unique().value();

		var sessionVisits = arrUnique(projected);

		var today = moment().startOf('day');
		var pastEnd = moment.utc(today).subtract(1, 'days');
		var pastBegin = moment.utc(pastEnd).subtract(7,'years');

		if( secure.isInAnyGroups(thisUser, "customer"))	{
				filter = {
					$and: [
					{client : thisUser.orgRef}
					, {startDate: {$gte: pastBegin, $exists: true, $ne: null}}
					]
					};

				// filter = {client : thisUser.orgRef};  // all visits by his company
			}
			else if(secure.isInAnyGroups(thisUser, "exec")){
				filter = {startDate: {$gte: pastBegin, $exists: true, $ne: null}};
			}
			else if(secure.isInAnyGroups(thisUser, "admin")){
				filter = {startDate: {$gte: pastBegin, $exists: true, $ne: null}};
			}
			else if( secure.isInAnyGroups(thisUser, "vManager")){
				filter = {

					$and: 
					[
					 	{startDate: {$gte: pastBegin, $exists: true, $ne: null}},

						{$or: 
						[
							{createBy: userId}
							, {agm: userId}
							, {anchor: userId}
							, {secondaryVmanager: userId}
							, {'cscPersonnel.salesExec': userId}
							, {'cscPersonnel.accountGM': userId}
							, {'cscPersonnel.industryExec': userId}
							, {'cscPersonnel.globalDelivery': userId}
							, {'cscPersonnel.cre': userId}
							, {'_id': { $in: sessionVisits }}
							, {'invitees': userId }
						]}

					]
				};
			} // end of secure if
			else if( secure.isInAnyGroups(thisUser, "user")){
				filter = {

					$and: 
					[
					 	{startDate: {$gte: pastBegin, $exists: true, $ne: null}},

						{$or: 
						[
							{createBy: userId}
							, {agm: userId}
							, {anchor: userId}
							, {secondaryVmanager: userId}
							, {'cscPersonnel.salesExec': userId}
							, {'cscPersonnel.accountGM': userId}
							, {'cscPersonnel.industryExec': userId}
							, {'cscPersonnel.globalDelivery': userId}
							, {'cscPersonnel.cre': userId}
							, {'_id': { $in: sessionVisits }}
							, {'invitees': userId }
						]}

					]
				};
			}
			var visitsByTimeline = new Array();

			model
			.find(filter)	
			.limit(perPage)
		    .skip(perPage*page)		
			.populate('client')
			.sort('startDate')
			.exec(function(err, list){
				// console.log("------- list in getMyVisits() = " , list);
				if(err) {
					deferred.reject(err);
				}
				else{
					transform(list);
					deferred.resolve(visitsByTimeline);
					// console.log(" ------------ visitsByTimeline = ", visitsByTimeline)
					// console.log(" ------------ visitsByTimeline[past].visits.length = ", visitsByTimeline["past"].visits.length	)
				}
			})

			function transform(visits){

				var visitsSorted =  _.sortBy( visits, 'startDate' );
				visitsSorted.forEach(function(visit){


					var involved = [];

					// add visit level participants
					if(stringCmp(visit.anchor,thisUser._id)){
						var thisOne = {
							id : visit._id,
							type: "Visit",
							title: "Full Visit participation",
							startTime : DateReplaceTime(visit.startDate, "08:30"),
							endTime : DateReplaceTime(visit.endDate, "18:30"),
							role : "Sponsor"
						};
						involved.push(thisOne);
					}

					if(stringCmp(visit.agm, thisUser._id)){
						var thisOne = {
							id : visit._id,
							type: "Visit",
							title: "Full Visit participation",
							startTime : DateReplaceTime(visit.startDate, "08:30"),
							endTime : DateReplaceTime(visit.endDate, "18:30"),
							role : "Visit Manager"
						};
						involved.push(thisOne);
					}

					if(visit.invitees !== undefined){
						if(arrContains(visit.invitees, thisUser._id)){
							var thisOne = {
								id : visit._id,
								type: "Visit",
								title: "Full Visit participation",
								startTime : DateReplaceTime(visit.startDate, "08:30"),
								endTime : DateReplaceTime(visit.endDate, "18:30"),
								role : "Special Invitee"
							}
							involved.push(thisOne);
						}
					}else {
					}

					userSessions.forEach(function(thisSession){

						if(stringCmp(thisSession.visit, visit._id)){
							// sesion level participants
							if(stringCmp(thisUser._id,thisSession.session.owner)){
								var thisOne = {
									id : thisSession._id,
									startTime : thisSession.session.startTime,
									endTime : thisSession.session.endTime,
									type : thisSession.session.type,
									title : thisSession.session.title,
									role : thisSession.session.type == "presentation"? "Speaker" : "Owner"
								}
								involved.push(thisOne);
							}

							if(stringCmp(thisUser._id,thisSession.session.supporter)){
								var thisOne = {
									id : thisSession._id,
									startTime : thisSession.session.startTime,
									endTime : thisSession.session.endTime,
									type : thisSession.session.type,
									title : thisSession.session.title,
									role : "Supporter"
								}
								involved.push(thisOne);
							}

							if(thisSession.invitees !== undefined){
								if(arrContains(thisSession.invitees, thisUser._id)){
									var thisOne = {
										id : thisSession._id,
										startTime : thisSession.session.startTime,
										endTime : thisSession.session.endTime,
										type : thisSession.session.type,
										title : thisSession.session.title,
										role : "Session Invitee"
									}
									involved.push(thisOne);
								}
							}
							else {
							}
						}
					}) // end of visit -> session foreach loop

					visit.set('involved', involved,  { strict: false });
				}) // end of visit loop

var today = moment().startOf('day');
var	thisWeekBeginsOn = moment.utc(today).startOf('isoweek').isoWeekday(0);
var thisWeekEndsOn = moment.utc(today).endOf('isoweek').isoWeekday(6);
var nextWeekBeginsOn = moment.utc(thisWeekEndsOn).add(1,'days');
var nextWeekEndsOn = moment.utc(nextWeekBeginsOn).add(7,'days');
var pastEnd = moment.utc(today).subtract(1, 'days');
var pastBegin = moment.utc(pastEnd).subtract(7,'years');
var furtherStart = moment.utc(today).add(1, 'days');
var furtherEnd = moment.utc(furtherStart).add(1,'years');
var thisWeek = today.range("week");
var thisDay = getDayRange(today);
var todayRange = moment.range(thisDay.start._d, thisDay.end._d);
var past = moment.range(pastBegin, pastEnd);
var further = moment.range(furtherStart, furtherEnd);
var nextOne = moment.range(thisDay.start._d, nextWeekEndsOn)

	// console.log("---------- visitsSorted  = " ,visitsSorted);
	// console.log("---------- visitsSorted.length  = " ,visitsSorted.length);
visitsByTimeline = {


	"past":{
		start: pastBegin,
		end: pastEnd,
		visits: ((timeline.contains('past')||timeline.contains('all'))? filterByRange(visitsSorted, past) : null)
	},
	"today":{
		start: thisDay.start._d,
		end: thisDay.end._d,
		visits: ((timeline.contains("today")||timeline.contains('all'))?filterByRange(visitsSorted, todayRange): null)
	},
	"further":{
		start: furtherStart,
		end: furtherEnd,
		visits: ((timeline.contains("further")||timeline.contains('all'))? filterByRange(visitsSorted, further) : null)
	},
	"next-one":{
		start: thisDay.start._d,
		end: nextWeekEndsOn,
		visits: ((timeline.contains("next-one")||timeline.contains('all'))? filterByRange(visitsSorted, nextOne)[0] : null)
	}
}

}	//	end of transform

function filterByRange(visits, range){
	// console.log("----- visits = ", visits)
	// console.log("----- visits.length = ", visits.length)
	return(
		visits.filter(function(x){
	// console.log("----- visits.filter  x._id = ", x._id + ",  x.startDate = " , x.startDate +  ",  x.endDate = ", x.endDate)
			var visitRange = moment.range(x.startDate, x.endDate);
	// console.log("----- visitRange = ", visitRange)
	// console.log("--------- range = " , range   +"----- range.overlaps(visitRange) = ", range.overlaps(visitRange))
			
			return range.overlaps(visitRange);
			// return true;
					})
		);
}
		}) //end of getUserSessions
.catch(function (err) {
	logger.writeLine("Error " + err);
	console.log(err.stack)
});

return deferred.promise;

} // getMyVisits method ends

/// For a given user Returns list of all the visitId by participating sessions
function getUserSessions(userId){
	var filter = {
		$or: [
		{'session.owner': userId}
		, {'session.supporter': userId}
		, {'invitees': userId }
		]
	};

	var deferred = Q.defer();
	scheduleModel
	.find(filter)
	.exec(function(err, list){
		if(err){
			console.log(err);
			deferred.reject(err);
		}
		else {
			deferred.resolve(list);
		}
		}) // end of scheduleModel exec

	return deferred.promise;
} // end of getUserSessions

function getOneById(id){
	var deferred = Q.defer();

	model
	.findOne({ _id: id })
	.populate('agm')
	.populate('anchor')
	.populate('keynote.note')
	.populate('secondaryVmanager')
	.populate('createBy')
	.populate('client')
	.populate('comments')
	.populate('feedbackTmpl')
	.populate('sessionTmpl')
	.populate({path:'cscPersonnel.salesExec'})
	.populate({path:'cscPersonnel.accountGM'})
	.populate({path:'cscPersonnel.industryExec'})
	.populate({path:'cscPersonnel.globalDelivery'})
	.populate({path:'cscPersonnel.cre'})
	.exec(function (err, item) {
		if(err) {
			console.log(err);
			deferred.reject(err);
		}
		else
			deferred.resolve(item);
	});
	return deferred.promise;

} // gentOneById method ends

/// Retrieve list of sessions by visit Id
function getSessionsById(id){
	var deferred = Q.defer();

	var sessionDays = [];

	model
	.findOne({ _id: id })
	.exec(function (err, visit) {
		if(err) {
			deferred.reject(err);
		}
		else{
			scheduleModel
			.find({ visit: id })
			.sort('session.startTime')
			.exec(function (err, sessions){
				if(err){
					deferred.reject(err);
				}
				else{
					transform(visit, sessions);
					deferred.resolve(sessionDays);
				}
						}); // end of scheduleModel find
					} // end of if else
    }); // end of model find

		// Internal method to transform visit data to session
		function transform(visit, sessions)
		{
			var vistSchedule =  _.sortBy( visit.schedule, 'startDate' );

			// first built list of all days with location from visit data
			var i=1;
			vistSchedule.forEach(function(sch){

				// loop thru each of the days in the schedule
				var dayRange = moment.range(sch.startDate, sch.endDate);
				dayRange.toArray('days').forEach(function(d){

					// filter schedule data for each of the days
					var daySessions = sessions.filter(function(x){
						var thisDay = moment(x.scheduleDate);
						return d.isSame(thisDay, 'day')
					});

					// skip days for which sessions are not scheduled
					// if(daySessions.length > 0){
						var schedule = {
							day : i,
							date : d,
							location: sch.location,
							sessions: daySessions
						}; // end of schedule object

						i++;
					// }

					sessionDays.push(schedule);
				}); // end of date range loop
			}); // end of visit vistSchedule loop
		}

		return deferred.promise;
} // getSessionsById method ends

function getSchedulesById(id){
	var deferred = Q.defer();

	var sessionDays = [];

	model
	.findOne({ _id: id })
	.exec(function (err, visit) {
		if(err) {
			logger.writeLine('error',0,err);
			deferred.reject(err);
		}
		else{
			scheduleModel
			.find({ visit: id })
			.exec(function (err, sessions){
				if(err){
					logger.writeLine('error',0,err);
					deferred.reject(err);
				}
				else{
					transform(visit, sessions);
					deferred.resolve(sessionDays);
				}
						}); // end of scheduleModel find
					} // end of if else
    }); // end of model find

		// Internal method to transform visit data to session
		function transform(visit, sessions)
		{
			var vistSchedule =  _.sortBy( visit.schedule, 'startDate' );

			// first built list of all days with location from visit data
			var i=1;
			vistSchedule.forEach(function(sch){

				// loop thru each of the days in the schedule
				var dayRange = moment.range(sch.startDate, sch.endDate);
				dayRange.toArray('days').forEach(function(d){

					// filter schedule data for each of the days
					var daySessions = sessions.filter(function(x){
						var thisDay = moment(x.scheduleDate);
						return d.isSame(thisDay, 'day')
					});

					// skip days for which sessions are not scheduled
					if(daySessions.length > 0){
						var schedule = {
							day : i,
							date : d,
							location: sch.location
						}; // end of schedule object

						i++;
					}

					sessionDays.push(schedule);

				}); // end of date range loop

			}); // end of visit vistSchedule loop
		}
		return deferred.promise;
}  // getSchedulesById method ends

function getKeynotesById(id){

	var deferred = Q.defer();
	var keynotesWelcome = [],keynotesThankyou = [];
	var keynotes= [keynotesWelcome,keynotesThankyou];
	model
	.findOne({ _id:id})
	.populate('keynote.note')
	.exec(function (err, item) {
		if(err) {
			console.log(err);
			deferred.reject(err);
		}
		else
			//fetching keynotes
			for (var i=0; i<item.keynote.length; i++){
				if(item.keynote[i].context == 'welcome')
				{
				keynotesWelcome.push(transform(item.keynote[i]));
				}

				if(item.keynote[i].context == 'thankyou')
				{
				keynotesThankyou.push(transform(item.keynote[i]));
				}
			}

			keynotesWelcome.sort(sortOn("order"));
			keynotesThankyou.sort(sortOn("order"));
			deferred.resolve(keynotes);
	});

	function transform(keynote)
	{
		if (keynote==null) {
			console.log("error in adding");
		}
		else{
			var keynoteData={
				order :keynote.order,
				context :keynote.context,
				title : keynote.note.title,
				noteText :keynote.note.noteText,
				noteBy :keynote.note.noteBy,
				noteBy1 :keynote.note.noteBy1,
				noteBy2 :keynote.note.noteBy2,
				createOn :keynote.note.createOn,
				desc: keynote.note.desc,
				attachment: keynote.note.attachment
			}
			return keynoteData;
		}
	}

	function sortOn(property){
		return function(a, b){
			if(a[property] < b[property]){
				return -1;
			}else if(a[property] > b[property]){
				return 1;
			}else{
				return 0;
			}
		}
	}
	return deferred.promise;
}

function getLocationsById(id)
{
	var deferred = Q.defer();
	var locations = [];

	model
	.findOne({ _id: id })
	.exec(function (err, item) {
		if(err) {
			console.log(err);
			deferred.reject(err);
		}

		else
		{
			//fetching locations
			for (var i=0; i<item.schedule.length; i++){
				var startDate = moment(item.schedule[i].startDate).format('YYYY-MM-DDTHH:mm:ss.SSSS');
				var endDate = moment(item.schedule[i].endDate).format('YYYY-MM-DDTHH:mm:ss.SSSS');
				var dr    = moment.range(startDate, endDate);
				var daysDiff = dr.diff('days'); // dates diff
				for(var k=0;k<=daysDiff;k++)
				{
					locations.push(item.schedule[i].location);
				}
			}
		}

		deferred.resolve(locations);
	});
	return deferred.promise;
}

function create(data) {
	var deferred = Q.defer();

	model.create(data, function (err, doc) {
		if (err) {
			console.log("err- " + err);
			deferred.reject(err);
		}
		else
		{
			deferred.resolve(doc);
		}
	});

	return deferred.promise;
}

function updateById(id, data) {
	var deferred = Q.defer();

	model.findByIdAndUpdate(id, data, function (err, doc) {
		if (err) {
			deferred.reject(err);
		}
		else
			deferred.resolve(doc);
	});

	return deferred.promise;
}



function getvalidationById(id, data){
	var deferred = Q.defer();
	var errMessgs=[];
	model
	.findByIdAndUpdate(id, data)
	.populate('keynote.note')
	.populate('feedbackTmpl')
	.populate('sessionTmpl')
	.exec(function (err, item) {
		if(err) {
			console.log(err);
			deferred.reject(err);
		}
		else{
			if (item.preview === "poor" || item.preview === "" || item.preview === undefined || item.preview === null) {
				errMessgs.push("Make sure to check the preview in Mobile.");
			}
			if(item.feedbackTmpl === "" || item.feedbackTmpl === undefined || item.feedbackTmpl === null){
				errMessgs.push("Feedback Template needs to be defined.");
			}
			if(item.sessionTmpl === "" || item.sessionTmpl === undefined || item.sessionTmpl === null){
				errMessgs.push("Session Template needs to be defined.");

			}
			if(item.keynote.length != 0 || item.keynote.length == 0 ){
				var count=0;
				var count1=0;
				for (var i=0; i<item.keynote.length; i++){
					if(item.keynote[i].context === 'welcome')
					{
						count++;
					}
					if(item.keynote[i].context === 'thankyou')
					{
						count1++;
					}
				}
				if (count == 0) {
					errMessgs.push("There should be Atleast one welcome message in the keynote.");
				}
				if (count1 == 0) {
					errMessgs.push("There should be Atleast one Thankyou keynote.");
				}				
			}
		}
		getSessionsById(item._id)
		.then(function(schedule){
			if(schedule){
				for(var i=0;i<schedule.length;i++){
					if (schedule[i].sessions <= 0 || schedule[i].sessions == undefined || schedule[i].sessions == null ) {

						errMessgs.push(util.formatString("Session is missing for day %s on date %s. ",schedule[i].day,moment(schedule[i].date).format('DD-MMM-YYYY')));
					}
					deferred.resolve(errMessgs);
				}
			}
		})
	});
return deferred.promise;

} // gentOneById method ends

function deleteById(id) {
	var deferred = Q.defer();

	model.findByIdAndRemove(id, function (err, doc) {
		if (err) {
			deferred.reject(err);
		}
		else{
			deferred.resolve(doc);
		}
	});

	return deferred.promise;
}
function getParticipantsByIdOrdering(id){
	var deferred = Q.defer();

	var emp = [];
	var client = [];

	model
	.findOne({ _id: id })
	.populate('client')
	.populate('visitors.visitor')//visit.invitees
	.populate('invitees')//visit.invitees

	.exec(function (err, visit) {
		if(err) {
			console.log(err);
			deferred.reject(err);
		}
		else{
			// push all client executives

			if (visit.client!= null){
				if (visit.client.cscPersonnel.salesExec!= null) {
					arrAddItem(emp, visit.client.cscPersonnel.salesExec);
				};
				if (visit.client.cscPersonnel.accountGM!= null) {
					arrAddItem(emp, visit.client.cscPersonnel.accountGM);
				};
				if (visit.client.cscPersonnel.industryExec!= null) {
					arrAddItem(emp, visit.client.cscPersonnel.industryExec);
				}
				if (visit.client.cscPersonnel.globalDelivery!= null) {
					arrAddItem(emp, visit.client.cscPersonnel.globalDelivery);
				}
				if (visit.client.cscPersonnel.cre!= null) {
					arrAddItem(emp, visit.client.cscPersonnel.cre);
				}
			}

			// push all client/emp side visitors
			visit.visitors.forEach(function(v){
				if (v.visitor!= null && v.visitor!= undefined && v.visitor!= "" ){
					switch(v.visitor.association)    {
						case "employee":
						arrAddItem(emp, v.visitor);
						break;

						case "customer":
						arrAddItem(client, v.visitor);
						break;
					}
				}
			})

			
					var uEmp = arrUnique(emp);
					var uClient = arrUnique(client);
					userModel
					.find({'_id': { $in: uEmp }})
					.select('_id name email avatar summary jobTitle organization contactNo association')
					.exec(function(err, empsData){
						if(err)
							console.log(err);
						userModel
						.find({'_id': { $in: uClient }})
						.select('_id name email avatar summary jobTitle organization contactNo association')
						.exec(function(err, clientsData){
							if(err)
								console.log(err);
						deferred.resolve({
							"clients": clientsData,
							"employees": empsData
						});

					})//end of user model for clients
				}) //end of user model for emp
		}
	})//end of visit model
		return deferred.promise;
}

function getParticipantsById(id){
	var deferred = Q.defer();

	var emp = [];
	var client = [];

	model
	.findOne({ _id: id })
	.populate('visitors.visitor')//visit.invitees

	.exec(function (err, visit) {
		if(err) {
			console.log(err);
			deferred.reject(err);
		}
		else{
			visit.visitors.forEach(function(v){
				if (v.visitor!= null && v.visitor!= undefined && v.visitor!= "" ){
					switch(v.visitor.association)    {
						case "employee":
						emp.push(transform(v.visitor));
						break;

						case "customer":
						client.push(transform(v.visitor));
						break;
					}
				}
			})
			deferred.resolve({
				"clients": client,
				"employees": emp
			});
		}
	});
	function transform(type)
	{
		var typeData={
			_id:type._id,
			name :type.name,
			avatar :type.avatar,
			jobTitle :type.jobTitle,
			summary :type.summary,
			email :type.email,
			contactNo :type.contactNo[0].contactNumber,
			organization: type.organization,
			association:type.association
		}
		return typeData;
	}
	return deferred.promise;
}


function getParticipantsForOverAllFeedback(id){
	var deferred = Q.defer();

	var emp = [];
	var client = [];

	model
	.findOne({ _id: id })
	.populate('client')
	.populate('visitors.visitor')//visit.invitees
	.populate('invitees')//visit.invitees

	.exec(function (err, visit) {
		if(err) {
			console.log(err);
			deferred.reject(err);
		}
		else{
			// push all client executives

			if (visit.client!= null){
				if (visit.client.cscPersonnel.salesExec!= null) {
					arrAddItem(emp, visit.client.cscPersonnel.salesExec);
				};
				if (visit.client.cscPersonnel.accountGM!= null) {
					arrAddItem(emp, visit.client.cscPersonnel.accountGM);
				};
				if (visit.client.cscPersonnel.industryExec!= null) {
					arrAddItem(emp, visit.client.cscPersonnel.industryExec);
				}
				if (visit.client.cscPersonnel.globalDelivery!= null) {
					arrAddItem(emp, visit.client.cscPersonnel.globalDelivery);
				}
				if (visit.client.cscPersonnel.cre!= null) {
					arrAddItem(emp, visit.client.cscPersonnel.cre);
				}
			}

			// push all client/emp side visitors
			visit.visitors.forEach(function(v){
				if (v.visitor!= null && v.visitor!= undefined && v.visitor!= "" ){
					switch(v.visitor.association)    {
						case "employee":
						arrAddItem(emp, v.visitor);
						break;

						case "customer":
						arrAddItem(client, v.visitor);
						break;
					}
				}
			})

			// push key visit personnel
			arrAddItem(emp, visit.anchor);
			arrAddItem(emp, visit.secondaryVmanager);
			// push all client/emp side invitees
			if (visit.invitees.length!=0 && visit.invitees!= undefined && visit.invitees != null && visit.invitees != "") {
				for (var i = 0; i < visit.invitees.length; i++) {
					switch(visit.invitees[i].association)    {
						case "employee":
						arrAddItem(emp, visit.invitees[i]);
						break;

						case "customer":
						arrAddItem(client, visit.invitees[i]);
						break;
					}
				}
			}

			// push participants from visit schedules
			scheduleModel
			.find({visit: id})
			.populate('invitees')
			.populate('session.owner')
			.populate('session.supporter')
			.exec(function(err, schedules){
				if(err)
					console.log(err);
				else {
					schedules.forEach(function(sch){
						if (sch.session.owner!= null) {
							if(sch.session.owner.association != "customer"){
								arrAddItem(emp, sch.session.owner);
							}

						}
						if (sch.session.supporter!= null) {
							if(sch.session.supporter.association != "customer"){
								arrAddItem(emp, sch.session.supporter);
							}
						}
						if (sch.invitees.length!=0 && sch.invitees!= undefined && sch.invitees != null && sch.invitees != "") {
							for (var i = 0; i < sch.invitees.length; i++) {
								switch(sch.invitees[i].association)    {
									case "employee":
									arrAddItem(emp, sch.invitees[i]);
									break;

									case "customer":
									arrAddItem(client, sch.invitees[i]);
									break;
								}
							}
						}
					})

					var uEmp = arrUnique(emp);
					var uClient = arrUnique(client);
					userModel
					.find({'_id': { $in: uEmp }})
					.select('_id name email avatar summary jobTitle organization contactNo association')
					.exec(function(err, empsData){
						if(err)
							console.log(err);
						userModel
						.find({'_id': { $in: uClient }})
						.select('_id name email avatar summary jobTitle organization contactNo association')
						.exec(function(err, clientsData){
							if(err)
								console.log(err);

						deferred.resolve({
							"clients": clientsData,
							"employees": empsData
						});

					})//end of user model for clients
				}) //end of user model for emp
				}
			})							
		}
	})//end of visit model
		return deferred.promise;
}


function getCount(){
    var deferred = Q.defer();
    var today = moment().startOf('day');
	var pastEnd = moment.utc(today).subtract(1, 'days');
	var pastBegin = moment.utc(pastEnd).subtract(7,'years');

    model.count({ 'startDate': {$gte: pastBegin, $exists: true, $ne: null} }, function(err, count){
        if(err) {
            console.log(err);
            deferred.reject(err);
        }
        else{
            deferred.resolve({totalCount:count});
        }
        
    });
    return deferred.promise;
}


function getVisitSessionsByDate(visitId, thisDate){
	var deferred = Q.defer();

	var  filter = {
		$and: [
				{'visit': visitId}
		  , {'scheduleDate': thisDate }
		]
	};

	scheduleModel
		.find(filter)
		.sort('session.startTime')
		.exec(function(err, sessions){
			if(err){
				console.log(err);
				deferred.reject(err)
			}
			else {
				deferred.resolve(sessions);
			}
		});
		return deferred.promise;
}

function pushSession(sessionId, time, sesnstatus, ssnpushtype){
		console.log(ssnpushtype);
	var deferred = Q.defer();
	scheduleModel
		.findOne({'_id': sessionId})
		.exec(function(err, session){
			if(err){
				console.log(err);
				deferred.reject(err);
			}
			else {
				getVisitSessionsByDate(session.visit, session.scheduleDate)
				.then(function(allSessions){
				
					allSessions.forEach(function(sess){
	                    if(ssnpushtype == 'push'){
	                    	console.log('hiiipush');
							if(sess.session.startTime >= session.session.startTime){
								if(sess.status == 'cancelled'){
					
						       updateSessions(allSessions);
								}
								else{
									sess.session.startTime = DateAddTime(sess.session.startTime, time);
									sess.session.endTime = DateAddTime(sess.session.endTime, time);
						            updateSessions(allSessions);
									
								} // end of if
							}
	                    }

	                    if(ssnpushtype == 'duration'){
	                    	console.log('hiii');
	                    	console.log(sess.session.startTime);
	                    	console.log(session.session.startTime);

							var timeStart = new Date(sess.session.startTime).getTime();
							var timeEnd = new Date(session.session.startTime).getTime();
							var hourDiff = timeEnd - timeStart; //in ms
							var secDiff = hourDiff / 1000; //in s
							var minDiff = hourDiff / 60 / 1000; //in minutes
							var hDiff = hourDiff / 3600 / 1000; //in hours
							var humanReadable = {};
							humanReadable.hours = Math.floor(hDiff);
							humanReadable.minutes = minDiff - 60 * humanReadable.hours;
							console.log(humanReadable); //{hours: 0, minutes: 30} 
                             
                             if(humanReadable.minutes == 0 && humanReadable.minutes == 0){
                             	console.log('equal');
                             	 sess.session.startTime = session.session.startTime;
								 sess.session.endTime = DateAddTime(sess.session.endTime, time);
								 updateSessions(allSessions);
                             }

	                    	if(sess.session.startTime === session.session.startTime){
	                    		console.log('equal');
	                    	}
	                    			if(sess.session.startTime > session.session.startTime){
	                    				console.log('greater')
								if(sess.status == 'cancelled'){
					
						       updateSessions(allSessions);
								}
								else{
									sess.session.startTime = DateAddTime(sess.session.startTime, time);
									sess.session.endTime = DateAddTime(sess.session.endTime, time);
							
                                  updateSessions(allSessions);
									
								} // end of if
							}
                          
						                    }

					}); // end of sess forEach

						if(sesnstatus == 'cancelled'){
							
				session.status = "cancelled"
		
           updateSessions(allSessions)
			}
				})
			
			} // end of if err 
			deferred.resolve("Done");
		}); // end of find schedule

	return deferred.promise;
}


function updateSessions(allSessions){
var deferred = Q.defer();
console.log(allSessions);
				allSessions.forEach(function(sess){
				var json = JSON.parse(sess);
				if(json.flag == "cancelled"){
			   scheduleModel
		      .findOne({'_id': json._id})
		      .exec(function(err, session){
				if(err){
					console.log(err);
					deferred.reject(err);
				}      
				 console.log("original", session.session.startTime);
	                    console.log("updated", json.session.startTime);
	                      json.session.startTime = session.session.startTime;
			                    json.session.endTime = session.session.endTime;
			                    console.log("updated session...", json);
			       	   scheduleModel.findByIdAndUpdate(json._id, json, function (err, doc) {
			                  
									if (err) {
										console.log("error updating session");
										console.log(err.stack);
									}
								console.log(json.flag);
								console.log(json._id);

								if(json.flag == 'cancelled')
								{
									var emailController = require(constants.paths.scripts + "/email");
									emailController.cancelledCalendarInvites(json._id);
								}
	               
								});	
			    });
					}
				else{
		        scheduleModel.findByIdAndUpdate(json._id, json, function (err, doc) {
		                    
								if (err) {
									console.log("error updating session");
									console.log(err.stack);
								}

								console.log(json.flag);
								console.log(json._id);
								if(json.flag == 'updated')
								{	
									var emailController = require(constants.paths.scripts + "/email");
									emailController.calendarInvites(json._id);
								}


							});	
		    }
					});deferred.resolve(allSessions);
				
							return deferred.promise;

}
function getRegionsHeads(id) {
	var deferred = Q.defer();

	model
	.findOne({ _id: id })
	.populate('client')
	.exec(function (err, item) {
		if(err) {
			console.log(err);
			deferred.reject(err);
		}
		else {
			regionsModel
			.findOne({regName: item.client.regions})
			.populate('regHead')
			.exec(function(err1, item1) {
				if(err1) {
					console.log(err1);
					deferred.reject(err1);
				}
				else {
					if(item1 != null){
						if(item1.regHead != null){
							deferred.resolve(item1.regHead.email);
						}
						else{
							deferred.resolve("null");
						}
					}
					else{
						deferred.resolve("null");
					}
				}
			});
		}
	});
	return deferred.promise;
}


function getOfferingsHeads(id) {
	var deferred = Q.defer();
	var allOfferings = [];
	var visitOfferings = [];
	var visitOfferingHeads = [];

	executivesModel
	.find()
	.populate('offHead')
	.exec(function(err, item){
		if(err) {
			console.log(err);
			deferred.reject(err);
		}
		else {
			allOfferings = item;
			model
			.findOne({_id: id})
			.exec(function (err1,item1){
				if(err1) {
					console.log(err1);
					deferred.reject(err1);
				}
				else {
					if(item1 != null) {
						visitOfferings = item1.offerings;
						// console.log(visitOfferings);
						transform(allOfferings, visitOfferings);
						deferred.resolve(visitOfferingHeads);
					}
					else{
						deferred.resolve("null");
					}
				}
			}); //end of visit model
		} //endofif else
	}); //end of exective model

	function transform(allOfferings, visitOfferings) {
		for (var i = 0; i < visitOfferings.length; i++) {

			for (var j = 0; j < allOfferings.length; j++) {

				 if(visitOfferings[i] == allOfferings[j].offName) {
					if(allOfferings[j].offHead != null){
						visitOfferingHeads.push(allOfferings[j].offHead.email);
					}
				}
			}
		}
	}
	return deferred.promise;
}


function getVisitStats() {
	var deferred = Q.defer();

	var visitStats = [];

	var today = moment().startOf('day');

	model.find(
				{$and:
					[
						{"anchor": {$exists: true, $ne: null}},

						{$or:
							[
								{$and:
									[
										{"startDate": {$lte: today, $exists: true, $ne: null}},
										{"endDate": {$gte: today, $exists: true, $ne: null}}
									]
								},

								{$and:
									[
										{"startDate": {$gte: today, $exists: true, $ne: null}},
										{"endDate": {$gte: today, $exists: true, $ne: null}}
									]
								}
							]
						}
					]
				}
			)
		.populate('anchor')
		.populate('client')
		.populate('secondaryVmanager')
		.exec(function(err, list){
		if(err) {
			console.log(err);
			deferred.reject(err);
		}
		else
		{
			for (var i=0; i<list.length; i++){
				visitStats.push(transformVisitStats(list[i]));
			}
			deferred.resolve(visitStats);
		}
	});
	return deferred.promise;
}

function transformVisitStats(visitStats) {
	if (visitStats==null) {
			console.log("error in adding");
		}

	else {
		if(!(visitStats.secondaryVmanager == null || visitStats.secondaryVmanager == undefined ))
		{
			var visitStatsData = {
				client: visitStats.client,
				visitManager: [visitStats.anchor, visitStats.secondaryVmanager],
				startDate: visitStats.startDate,
				endDate: visitStats.endDate,
				locations: visitStats.locations
			}
		}
		else if (visitStats.secondaryVmanager == null || visitStats.secondaryVmanager == undefined)
		{
			var visitStatsData = {
				client: visitStats.client,
				visitManager: [visitStats.anchor],
				startDate: visitStats.startDate,
				endDate: visitStats.endDate,
				locations: visitStats.locations
			}
		}
		return visitStatsData;
	}
}

/// Retrieve list of sessions by visit Id
function getLastTimeSessionsById(id){
	var deferred = Q.defer();

	var sessionLastDays = [];

	model
	.findOne({ _id: id })
	.exec(function (err, visit) {
		if(err) {
			logger.writeLine('error',0,err);
			deferred.reject(err);
		}
		else{
			scheduleModel
			.find({ visit: id })
			.sort('session.startTime')
			.populate('session.owner')
			.populate('invitees')
			.exec(function (err, sessions){
				if(err){
					logger.writeLine('error',0,err);
					deferred.reject(err);
				}
				else{
					transform(visit, sessions);
					deferred.resolve(sessionLastDays);
				}
						}); // end of scheduleModel find
					} // end of if else
    }); // end of model find

		// Internal method to transform visit data to session
		function transform(visit, sessions)
		{
			sessionLastDays.push(sessions[sessions.length - 1]);
		}

		return deferred.promise;
} // getSessionsById method ends

/// Retrieve list of sessions by visit Id
function getAllSessionsById(id){
	var deferred = Q.defer();

	var sessionLastDays = [];

	model
	.findOne({ _id: id })
	.exec(function (err, visit) {
		if(err) {
			logger.writeLine('error',0,err);
			deferred.reject(err);
		}
		else{
			scheduleModel
			.find({ visit: id })
			.populate('client')
			.populate('comments')
			.sort('session.startTime')
			.exec(function (err, sessions){
				if(err){
					logger.writeLine('error',0,err);
					deferred.reject(err);
				}
				else{
					scheduleModel.populate(sessions, {
						path: 'comments.givenBy',
						model: userModel
					},
					function(err, sessionComp) {
						if(err) return callback(err);
     					 console.log(sessionComp); // This object should now be populated accordingly.
     					 transform(visit, sessionComp);
     					 deferred.resolve(sessionLastDays);
  					});
				}
			}); // end of scheduleModel find
		} // end of if else
    }); // end of model find

		// Internal method to transform visit data to session
		function transform(visit, sessions)
		{

			for(var i=0;i<sessions.length;i++)
			{
			sessionLastDays.push(sessions[i]);
			}
		}

		return deferred.promise;
} // getSessionsById method ends

/// Gen PDF-  Retrieve list of sessions by visit Id
function getPDFSessionsById(id){
	var deferred = Q.defer();

	var sessionDays = [];

	model
	.findOne({ _id: id })
	.exec(function (err, visit) {
		if(err) {
			logger.writeLine('error',0,err);
			deferred.reject(err);
		}
		else{
			scheduleModel
			.find({ visit: id })
			.sort('session.startTime')
			.populate('session.owner')
			.populate('invitees')
			.exec(function (err, sessions){
				if(err){
					logger.writeLine('error',0,err);
					deferred.reject(err);
				}
				else{
					transform(visit, sessions);
					deferred.resolve(sessionDays);
				}
						}); // end of scheduleModel find
					} // end of if else
    }); // end of model find

		// Internal method to transform visit data to session
		function transform(visit, sessions)
		{
			var vistSchedule =  _.sortBy( visit.schedule, 'startDate' );

			// first built list of all days with location from visit data
			var i=1;
			vistSchedule.forEach(function(sch){

				// loop thru each of the days in the schedule
				var dayRange = moment.range(sch.startDate, sch.endDate);
				dayRange.toArray('days').forEach(function(d){

					// filter schedule data for each of the days
					var daySessions = sessions.filter(function(x){
						var thisDay = moment(x.scheduleDate);
						return d.isSame(thisDay, 'day')
					});

					// skip days for which sessions are not scheduled
					// if(daySessions.length > 0){
						var schedule = {
							day : i,
							date : d,
							location: sch.location,
							sessions: daySessions
						}; // end of schedule object

						i++;
					// }

					sessionDays.push(schedule);
				}); // end of date range loop
			}); // end of visit vistSchedule loop
		}

		return deferred.promise;
} // getPDFSessionsById method ends