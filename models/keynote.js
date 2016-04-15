'use strict';

var mongoose = require('mongoose')
	, Schema = mongoose.Schema;

var userSchema = require('./user');

var keynoteSchema = new mongoose.Schema({

	title 						: { type: String, trim: true, required: true },
	noteText					: { type: String, trim: true, required: true },
	tags						: [],
	//noteBy					: [{ type: Schema.Types.ObjectId, ref: 'User' }],
	noteBy						: { type: Schema.Types.ObjectId, ref: 'User', required: true },
	createby                    :  { type: Schema.Types.ObjectId, ref: 'User' },
	createOn					: { type: Date, default: Date.now },
	desc						: { type: String, trim: true, required: true },
	externalLink				: { type: String, trim: true, required: true },
	attachment					: [{ type: String, trim: true, required: true }]

});

//var User = mongoose.model('User', userSchema);

module.exports = mongoose.model('keynotes', keynoteSchema);