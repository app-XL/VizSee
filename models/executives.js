'use strict';

var mongoose = require('mongoose')
	, Schema = mongoose.Schema;

var userSchema = require('./user');

var executiveSchema = new mongoose.Schema({

	offName						: { type: String },
	offHead						: { type: Schema.Types.ObjectId, ref: 'User' }

});


module.exports = mongoose.model('executives', executiveSchema);