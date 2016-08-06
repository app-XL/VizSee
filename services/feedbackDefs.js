'use strict';

var Q               = require('q');
var constants       = require('../scripts/constants');
var model           = require(constants.paths.models +  '/feedbackDef')

// Service method definition -- Begin
var service = {};

service.getAll = getAll;
service.create = create;

service.getOneById = getOneById;
service.updateById = updateById;
service.deleteById = deleteById;
service.getWithQuery = getWithQuery;
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
    .populate('noteBy')
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

function getWithQuery(query, fields, maxRecs, sortEx,type){
    var deferred = Q.defer();
    var feedbackType = [];
    model
    .find(query)
    .limit(maxRecs)
    .select(fields)
    .sort(sortEx)
    .exec(function (err, item) {
        if(err) {
            console.log(err);
            deferred.reject(err);
        }
        else {
            for(var i=0;i<item.length;i++)
            {
                if(item[i].type == type)
                {
                    feedbackType.push(item[i]);
                }
            }
            deferred.resolve(feedbackType);
        }

    });
    return deferred.promise;
} // getWithQuery method ends

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