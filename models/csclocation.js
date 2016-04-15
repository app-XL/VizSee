'use strict';

var mongoose = require('mongoose')
	, Schema = mongoose.Schema;

var csclocationSchema = new mongoose.Schema({

	id 							: { type: String },
	name						: { type: String, trim: true, required: true },
	info						: { type: String, trim: true, required: true },
	url							: { type: String, trim: true },
	pos 						: { type: [Number], index: '2dsphere'}

});


module.exports = mongoose.model('csclocations', csclocationSchema);