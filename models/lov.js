'use strict';

var mongoose = require('mongoose')
	, Schema = mongoose.Schema;

var lovSchema = new mongoose.Schema({

	name 							: { type: String, trim: true, required: true },
	values							: [{ type: String, trim: true, required: true }]

	});

module.exports = mongoose.model('lovs', lovSchema);