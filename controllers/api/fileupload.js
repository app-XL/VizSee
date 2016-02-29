'use strict';

var constants         = require('../../scripts/constants');

var controller = {}

controller.create = create;

module.exports = controller;

function create(req, res){
      console.log(req.files);
      console.log(req.files.file);
      console.log(req.files.file.path);
	  res.send(req.files);  
}