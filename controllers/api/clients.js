'use strict';

var constants         = require('../../scripts/constants');
var dataService     = require(constants.paths.services + '/clients');
var dataSetParam    = require(constants.paths.config + '/app');

var controller = {}

controller.getAll     = getAll;
controller.create     = create;

controller.getOneById = getOneById;
controller.updateById = updateById;
controller.deleteById = deleteById;
controller.getWithQuery = getWithQuery;
controller.getWithName = getWithName;
controller.getCount = getCount;

module.exports = controller;

function getAll(req,res){
    var perPage = dataSetParam.appInfo.UI.pagination.size;
    var page = 0;
    if(req.query.query!==undefined)
      {
        var query = JSON.parse(req.query.query);
    }
    if(req.param('start')!==undefined)
    {
        var page = Math.max(0, req.param('start'));
    }
    if(req.param('size')!==undefined)
    {
        var perPage = Math.min(25,req.param('size'));
    }

    var fields = req.param('fields');
    var sort = req.param('sort');

  dataService.getAll(page,perPage,sort,query,fields)
  .then(function(data){
    if (data){
        res.send(data);
    }else {
        res.sendStatus(404);
    }
})
  .catch(function (err){
    console.log("exception" + err);
    res.status(500).send(err);
});
}

function getOneById(req,res){
    dataService.getOneById(req.params.id)
    .then(function(data){
        if (data){
            res.send(data);
        }else {
            res.sendStatus(404);
        }
    })
    .catch(function (err){
        console.log("exception" + err);
        res.status(500).send(err);
    });
}

function getWithQuery(req,res){
    console.log(req.params);
    var name= req.param('query');
    var subname = req.param('subQuery');
    var industry = req.param('industry');
    var regions = req.param('regions');
    var sfdcid = req.param('sfdcid');
        var query = {
     $and: [
     { 'name' : new RegExp(name, 'i') },
     { 'subName' : new RegExp(subname, 'i') },
     { 'industry' : new RegExp(industry, 'i') },
     { 'regions' : new RegExp(regions, 'i') },
     { 'sfdcid' : new RegExp(sfdcid, 'i') }

     ]
    }
    var maxRecs = req.param('maxRecs');
    var fields = req.param('fields');
    var sort = req.param('sort');
    dataService.getWithQuery(query,fields ,maxRecs, sort)
    .then(function(data){
        if (data){
            res.send(data);
        }else {
            res.sendStatus(404).send("Doc dont exists");
        }
    })
    .catch(function (err){
        console.log("doc dont exists" + err);
        res.status(500).send(err);
    });
}

function getWithName(req,res){
    dataService.getWithName(req.params.name)
    .then(function(data){
        if (data){
            res.send(data);
        }else {
            res.sendStatus(404);
        }
    })
    .catch(function (err){
        console.log("exception" + err);
        res.status(500).send(err);
    });
}

function create(req, res) {
  dataService.create(req.body,res)
    .then(function (data) {
        if (data){
            res.send(data);
        }else {
            res.status(404).send("Doc not added");
        }
    })
    .catch(function (err) {
        console.log("cntrl create: err - " + err);
        res.status(500).send(err);
    });
}

// function create(req, res) {
//   dataService.create(req.body,res)
//   .then(function (data) {
//     res.status(200).send("Doc added successfully");
// })
//   .catch(function (err) {
//     console.log("cntrl create: err - " + err);
//     res.status(500).send(err);
// });
// }


function deleteById(req, res) {
  dataService.deleteById(req.params.id)
  .then(function () {
    res.status(200).send("Doc deleted successfully");
})
  .catch(function (err) {
    console.log("controller delete err: " + err);
    res.status(500).send(err);
});
}

function updateById(req, res) {
  dataService.updateById(req.params.id, req.body)
  .then(function () {
    res.status(200).send("Doc updated successfully");
})
  .catch(function (err) {
    console.log(err);
    res.status(500).send(err);
});
}



function getCount(req,res){
  dataService.getCount()
    .then(function(channelCount){
        console.log(channelCount);
        if (channelCount){
            res.send(channelCount);
        }else {
            res.status(404).send("Doc not found");
        }
    })
    .catch(function (err){
        console.log("exception" + err);
        res.status(500).send(err);
    });
} 