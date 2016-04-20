'use strict';

var constants         = require('../../scripts/constants');
var dataService     = require(constants.paths.services + '/groups');

var controller = {}

controller.getAll     = getAll;
controller.create     = create;

controller.getOneById = getOneById;
controller.updateById = updateById;
controller.deleteById = deleteById;
controller.getUsersByGroup = getUsersByGroup;

module.exports = controller;

function getAll(req,res){
  dataService.getAll()
    .then(function(userList){
        if (userList){
            res.send(userList);
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
    .then(function(userList){
        if (userList){
            res.send(userList);
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
  dataService.create(req.body)
    .then(function () {
        res.status(200).send("Doc added successfully");
    })
    .catch(function (err) {
        console.log("cntrl create: err - " + err);
        res.status(500).send(err);
    });
}

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

function getUsersByGroup(req,res){
	dataService.getUsersByGroup(req.params.name)
		.then(function(userList){
				if (userList){
						res.send(userList);
				}else {
						res.status(404).send(req.params.name + " does not exists");
				}
		})
		.catch(function (err){
				console.log("exception" + err);
				res.status(500).send(err);
		});
}
