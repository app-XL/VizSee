'use strict';

var mongoose = require('mongoose')
	, Schema = mongoose.Schema;

var factSchema = new mongoose.Schema({

	title 							: { type: String, trim: true, required: true },
	editedBy						: { type: Schema.Types.ObjectId, ref: 'User' },
	createOn						: { type: Date, default: Date.now },
	description						: { type: String, trim: true, required: true }
	});

module.exports = mongoose.model('facts', factSchema);