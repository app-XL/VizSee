'use strict';

var constants       = require('../scripts/constants');
var logger			     	= require(constants.paths.scripts + '/logger');
var pathMap	     			= require(constants.paths.views + '/assets/pathMap');

var pathBuilder = {}

pathBuilder.getPath     = getPath;

module.exports = pathBuilder;


function getPath(basePath, key){
  return (basePath + pathMap[key]);
}
