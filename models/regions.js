'use strict';

var mongoose = require('mongoose')
	, Schema = mongoose.Schema;

var userSchema = require('./user');

var regionSchema = new mongoose.Schema({

	regName						: { type: String },
	regHead						: { type: Schema.Types.ObjectId, ref: 'User' }

});

module.exports = mongoose.model('regions', regionSchema);