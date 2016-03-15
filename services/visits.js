'use strict';

var Q               = require('q');
var _								= require('underscore');
var moment 					= require('moment');  require('moment-range');
var constants       = require('../scripts/constants');
var util						= require(constants.paths.scripts + "/util");
var model           = require(constants.paths.models +  '/visit');
var scheduleModel   = require(constants.paths.models +  '/visitSchedule');

// Service method definition -- Begin
var service = {};

service.getAll = getAll;
service.create = create;

service.getOneById = getOneById;
service.getSessionsById = getSessionsById;
service.updateById = updateById;
service.deleteById = deleteById;

module.exports = service;

// Method implementations
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

function getOneById(id){
    var deferred = Q.defer();

    model
    .findOne({ _id: id })
    .populate('agm')
    .populate('anchor')
    .populate('createBy')
    .populate('client')
    //.populate('visitors.visitor')
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

function getSessionsById(id){
    var deferred = Q.defer();

		var sessionDays = [];

    model
    .findOne({ _id: id })
    .exec(function (err, visit) {
        if(err) {
            console.log(err);
            deferred.reject(err);
        }
        else{
					scheduleModel
						.find({ visit: id })
						.exec(function (err, sessions){
							if(err){
								console.log(err);
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
