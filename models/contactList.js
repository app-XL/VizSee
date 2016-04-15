'use strict';

var mongoose = require('mongoose')
	, Schema = mongoose.Schema;

var contactListSchema = new mongoose.Schema({

	location 					: { type: String, trim: true, required: true },
	type						: { type: String, trim: true, required: true },
	user						: { type: Schema.Types.ObjectId, ref: 'User',required: true }
	});

module.exports = mongoose.model('contactList', contactListSchema);