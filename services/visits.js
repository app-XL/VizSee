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

// Service method definition -- Begin
var service = {};

service.getAll = getAll;
service.create = create;

service.getOneById = getOneById;
service.getSessionsById = getSessionsById;
service.updateById = updateById;
service.deleteById = deleteById;

service.getMyVisits = getMyVisits;
service.getExecsById = getExecsById;

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

// Method implementations
//ToDo:: Fix Known issues
// 2. Date are not as per UTC, timezone is effecting the date filters
// 3. Custo9mers are not filtered by visit. They can access any visit of the client irrective of being part of it

function getMyVisits(thisUser, timeline, limit){
	logger.dump('test', 0, 'Initiate getMyVisits...', thisUser._id, timeline, limit);
	var deferred = Q.defer();

	// massage params
	if (timeline=="" || timeline===undefined)
		timeline = "all";

	if (limit=="" || limit===undefined)
		limit = 25;

	// by default filter not applicable for "vManager, exec"
	var filter = {};
	var userId = thisUser._id;
	var userSessions = "";

	logger.dump('test', 1,'getUserSessions...');
	getUserSessions(userId)
		.then(function(data){
			userSessions = data;
			logger.dump('test', 1,"Session wise visits", userSessions.length + " rec(s) found");

			var projected = _(userSessions).chain().flatten().pluck('visit').unique().value();
			logger.Json('test',projected);

			var sessionVisits = arrUnique(projected);
			logger.writeLine('test',0, 'Unique sessionVisits');
			logger.Json('test',sessionVisits);

			logger.dump('test', 1,"Checking user role...")
			if( secure.isInAnyGroups(thisUser, "customer"))	{
				logger.dump('test', 2,"Found customer!!!");
				filter = {client : thisUser.orgRef};  // all visits by his company
			}
			else if(secure.isInAnyGroups(thisUser, "exec")){
						logger.dump('test', 2,"Found exec!!!");
			}
			else if(secure.isInAnyGroups(thisUser, "vManager")){
						logger.dump('test', 2,"Found vManager!!!");
			}
			else if( secure.isInAnyGroups(thisUser, "user")){
				logger.dump('test', 2, "Found user!!!");
				filter = {
					$or: [
						{createBy: userId}
						, {agm: userId}
						, {anchor: userId}
						, {'client.salesExec': userId}
						, {'client.accountGM': userId}
						, {'client.industryExec': userId}
						, {'client.globalDelivery': userId}
						, {'client.cre': userId}
						, {'_id': { $in: sessionVisits }}
						, {'invitees': userId }
					]
				};
			} // end of secure if

		logger.dump('test', 0, "Find visits with filter");
		logger.dump('test', filter);

		var visitsByTimeline = new Array();
    model
			.find(filter)
			.populate('client')
			.limit(limit)
			.sort('startDate')
			.exec(function(err, list){
		      if(err) {
		        logger.error(0, 'find visits with filter', filter, err);
		        deferred.reject(err);
			    }
			    else{
						logger.dump('test', 1,"Visits found :: " + list.length);
						transform(list);
						logger.dump('test', 1,'------------------------------');
						logger.dump('test', 1,'Transformed data.....');
						logger.Json('test',visitsByTimeline)
		       	deferred.resolve(visitsByTimeline);
				 	}
			}) // end of model exec
			// .catch(function (err) {
			// 	logger.writeLine("Error " + err);
			// 	console.log(err.stack)
			// });

			function transform(visits){

				logger.dump('test', 0,"---------------------");
				logger.dump('test', 0,'Begin data tranformation...');

				var visitsSorted =  _.sortBy( visits, 'startDate' );

				visitsSorted.forEach(function(visit){
					logger.dump('test', 0,'----- transform with visit ------')
					logger.dump('test', 1,visit._id, visit.title, visit.startDate, visit.endDate);

					var involved = [];

					// add visit level participants
					logger.dump('test', 2,'Check Sponsor',visit.anchor, thisUser._id,stringCmp(visit.anchor, thisUser._id));
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

					logger.dump('test', 2,'Check vManager',visit.agm, thisUser._id,stringCmp(visit.agm, thisUser._id));
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
						logger.dump('test', 2,'Check Visit invitees',visit.invitees, thisUser._id, arrContains(visit.invitees, thisUser._id))
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
						logger.dump('test', 2,'visit invitees undefined');
					}

					logger.dump('test', 2,'Checking sessions...');
					userSessions.forEach(function(thisSession){
						logger.dump('test', 3, '--------- visit vs. session -----------');
						logger.dump('test', 3,thisSession._id,visit._id,thisSession.visit,stringCmp(thisSession.visit, visit._id));
						if(stringCmp(thisSession.visit, visit._id)){
							// sesion level participants
							logger.dump('test', 4,'session owner', thisUser._id,thisSession.session.owner, stringCmp(thisUser._id,thisSession.session.owner));
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

							logger.dump('test', 4,'session supporter',thisUser._id,thisSession.session.supporter, stringCmp(thisUser._id, thisSession.session.supporter))
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

							logger.dump('test', 4,'session invitees', thisSession.invitees, thisUser._id, arrContains(thisSession.invitees, thisUser._id))
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
								logger.dump('test', 4,'session invitees undefined');
							}
						}
						logger.dump('test', 3,'-------- end of sessions');
					}) // end of visit -> session foreach loop

					logger.dump('test', 3,'-------- end of visit');
					logger.dump('test', 3,'Involvement details....');
					logger.Json('test', involved);
					visit.set('involved', involved,  { strict: false });
					logger.Json('test', visit);
				}) // end of visit loop
				logger.dump('test', 3,'-------- end of all visits')

				var today = moment();

				var	thisWeekBeginsOn = moment(today).startOf('isoweek').isoWeekday(0);
				var thisWeekEndsOn = moment(today).endOf('isoweek').isoWeekday(6);

				var lastWeekEndsOn = moment(thisWeekBeginsOn).subtract(1,'days');
				var lastWeekBeginsOn = moment(lastWeekEndsOn).subtract(7,'days');
				var beforelastWeek = moment(lastWeekBeginsOn).subtract(1,'days');

				var nextWeekBeginsOn = moment(thisWeekEndsOn).add(1,'days');
				var nextWeekEndsOn = moment(nextWeekBeginsOn).add(7,'days');
				var afterNextWeek = moment(nextWeekEndsOn).add(1,'days');

				var pastBegin = moment(lastWeekBeginsOn).subtract(3,'years');
				var furtherEnd = moment(afterNextWeek).add(1,'years');

				var thisWeek = today.range("week");
				var thisDay = moment.range(today, today);
				var lastWeek = moment.range(lastWeekBeginsOn, lastWeekEndsOn);
				var nextWeek = moment.range(nextWeekBeginsOn, nextWeekEndsOn);
				var past = moment.range(pastBegin, beforelastWeek);
				var further = moment.range(afterNextWeek, furtherEnd);
				var nextOne = moment.range(today, nextWeekEndsOn)

				console.log("---- Date ranges ----")
				console.log("today: " + today.format("ddd D-MMM-YYYY"));
				console.log("this week:" + thisWeekBeginsOn.format("ddd D-MMM-YYYY") + " - " +
					thisWeekEndsOn.format("ddd D-MMM-YYYY") + " >> " + thisWeek.toString());
				console.log("last week:" + lastWeekBeginsOn.format("ddd D-MMM-YYYY") + " - " +
					lastWeekEndsOn.format("ddd D-MMM-YYYY") + " >> " + lastWeek.toString());
				console.log("next week:" + nextWeekBeginsOn.format("ddd D-MMM-YYYY") + " - " +
					nextWeekEndsOn.format("ddd D-MMM-YYYY") + " >> " + nextWeek.toString());
				console.log("past: " + pastBegin.format("ddd D-MMM-YYYY") + " - " +
					beforelastWeek.format("ddd D-MMM-YYYY") + " >> " + past.toString());
				console.log("further: "+ afterNextWeek.format("ddd D-MMM-YYYY") + " - " +
				 	furtherEnd.format("ddd D-MMM-YYYY") + " >> " + further.toString());
				console.log("next one: "+ today.format("ddd D-MMM-YYYY") + " - " +
					nextWeekEndsOn.format("ddd D-MMM-YYYY") + " >> " + nextOne.toString());

				visitsByTimeline = {
					"past":{
							start: pastBegin,
							end: beforelastWeek,
							visits: ((timeline.contains('past')||timeline.contains('all'))? filterByRange(visitsSorted, past) : null)
					},

					"last-week" : {
							start: lastWeekBeginsOn,
							end: lastWeekEndsOn,
							visits: ((timeline.contains("last-week")||timeline.contains('all'))? filterByRange(visitsSorted, lastWeek) : null)
					},

					"this-week":{
							start: thisWeekBeginsOn,
							end: thisWeekEndsOn,
							visits: ((timeline.contains("this-week")||timeline.contains('all'))? filterByRange(visitsSorted, thisWeek): null)
					},

					"today":{
							start: today,
							end: today,
							visits: ((timeline.contains("today")||timeline.contains('all'))?filterByRange(visitsSorted, thisDay): null)
					},

					"next-week":{
							start: nextWeekBeginsOn,
							end: nextWeekEndsOn,
							visits: ((timeline.contains("next-week")||timeline.contains('all'))? filterByRange(visitsSorted, nextWeek): null)
					},

					"further":{
							start: afterNextWeek,
							end: furtherEnd,
							visits: ((timeline.contains("next-week")||timeline.contains('all'))? filterByRange(visitsSorted, further) : null)
					},

					"next-one":{
							start: today,
							end: nextWeekEndsOn,
							visits: ((timeline.contains("next-one")||timeline.contains('all'))? filterByRange(visitsSorted, nextOne)[0] : null)
					}
				}

				logger.dump('test', 1,'-------- end of transformation')
			}

			function filterByRange(visits, range){
				return(
					visits.filter(function(x){
						var visitRange = moment.range(x.startDate, x.endDate);
						return range.overlaps(visitRange);
						//return range.contains(moment(x.startDate))
					})
				);
			}
		}) //end of getUserSessions
		.catch(function (err) {
			logger.writeLine("Error " + err);
			console.log(err.stack)
		});
    return deferred.promise;
} // getAll method ends

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
    .populate('createBy')
    .populate('client')
    .populate('feedbackTmpl')
    .populate('sessionTmpl')
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

function getExecsById(id){
    var deferred = Q.defer();
    var cscId = [],client = [];
    var partitions= [cscId,client];

    model
    .findOne({ _id: id })
    .populate('agm')
    .populate('anchor')
    .populate('client')
    .populate('visitors.visitor')
    .populate('invitees.invite')
    .exec(function (err, item) {
        if(err) {
            console.log(err);
            deferred.reject(err);
        }
        else{
                    cscId.push(transform(item.agm,'Sponsor'));
                    cscId.push(transform(item.anchor,'Anchor'));

                    //fetchnig invitees
                      for (var i=0; i<item.invitees.length; i++){
                        cscId.push(transform(item.invitees[i],'Invite'));
                      }
                    //fetchnig visitors
                      for (var i=0; i<item.visitors.length; i++){
                        client.push(transform(item.visitors[i].visitor,'Client Visitor'));
                      }

     var clientGet=item.client._id;
    //fectching client csc members from client schema
    clientModel
        .find({ _id : clientGet})
        .populate('cscPersonnel.salesExec')
        .populate('cscPersonnel.accountGM')
        .populate('cscPersonnel.industryExec')
        .populate('cscPersonnel.globalDelivery')
        .populate('cscPersonnel.cre')
               .select('name cscPersonnel.salesExec cscPersonnel.accountGM cscPersonnel.industryExec cscPersonnel.globalDelivery cscPersonnel.cre')
               .exec(function (err, val){
                  if(err){
                    console.log(err);
                    deferred.reject(err);
                          }
                 else{
                _.each(val, function(val, i) {
                     cscId.push(transform(val.cscPersonnel.salesExec,'Sales Executive'));
                     cscId.push(transform(val.cscPersonnel.accountGM,'Account General Manager'));
                     cscId.push(transform(val.cscPersonnel.industryExec,'Industry Executive'));
                     cscId.push(transform(val.cscPersonnel.globalDelivery,'Global Delivery'));
                     cscId.push(transform(val.cscPersonnel.cre,'CRE'));
                     client.push({clientName:val.name});
                     });

             //fectching owner,suppporter from visitScheduler schema
            scheduleModel
               .find({ visit: id })
               .populate('session.owner')
               .populate('session.supporter')
               .populate('invitees')
               .select('session.supporter session.owner invitees')
               .exec(function (err, data){
                  if(err){
                    console.log(err);
                    deferred.reject(err);
                          }
                 else{
                _.each(data, function(data, i) {
                     cscId.push(transform(data.session.owner,'Owner'));
                     cscId.push(transform(data.session.supporter,'Supporter'));
                     for (var i=0; i<data.invitees.length; i++){
                        cscId.push(transform(data.invitees[i],'Invitee'));
                      }
                });
            deferred.resolve(partitions);
            }
            })//scheduleModel closing
            }
            })//clientModel closing
          }

    });//model find on by id ends
    function transform(user, role)
        {
        	if (user==null) {
        		console.log("error in adding");
        	}
        	else{
            var typeData={
                name :(user.name),
                avatar :user.avatar,
                jobTitle :user.jobTitle,
                summary :user.summary,
                email :user.email,
                contactNo :user.contactNo,
                role: role
                }
                console.log("******************************");
                console.log(typeData);
                console.log("******************************");
                return typeData;
        }
    }

    return deferred.promise;

} // getExecsById method ends

/// Retrieve list of sessions by visit Id
function getSessionsById(id){
    var deferred = Q.defer();

		logger.writeLine('debug',0,"Sessions by visit Id " + id);
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
								logger.Json('test',sessionDays);
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
							location: sch.location,
							//count: daySessions.length,
							sessions: daySessions
						}; // end of schedule object

						i++;
					}

					sessionDays.push(schedule);
				}); // end of date range loop
			}); // end of visit vistSchedule loop
		}

    return deferred.promise;
} // getSessionsById method ends

function create(data) {
    var deferred = Q.defer();

    model.create(data, function (err, doc) {
        if (err) {
            console.log("err- " + err);
            deferred.reject(err);
        }
        else
        {
            deferred.resolve();
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
