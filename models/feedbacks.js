
'use strict';

var mongoose = require('mongoose')
	, Schema = mongoose.Schema;

var userSchema 				= require('./user');
var visitSchema 			= require('./visit');
var feedbackDefSchema = require('./feedbackDef');

var feedbackSchema = new mongoose.Schema({

	visitid						: { type: Schema.Types.ObjectId, ref: 'Visits', required:true },
	template					: { type: Schema.Types.ObjectId, ref: 'FeedbacDefs', required:true },
	providedBy					: { type: Schema.Types.ObjectId, ref: 'User', required:true },
	providedOn					: { type: Date, default: Date.now },
	feedbackOn					: {type: String, lowercase:true, enum: ['Session', 'Visit'], trim: true},

	item						: [{
		query						: { type: String, trim: true, required: true },
		mode						: { type: String, lowercase: true, trim: true, required:true,
		 									enum: ['freetext', 'single-choice', 'multi-choice', 'star-rating']},
		choices						: [ { type: String, trim: true, required:true } ],
		answer						: { type: String, trim: true, required:true }
	}]
});

module.exports = mongoose.model('feedbacks', feedbackSchema);