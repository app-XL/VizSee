'use strict';

var mongoose = require('mongoose')
	, Schema = mongoose.Schema;

var userSchema = require('./user');

var keynoteSchema = new mongoose.Schema({

	title 							: { type: String },
	noteText						: { type: String },
	tags								: [],
	//noteBy							: [{ type: Schema.Types.ObjectId, ref: 'User' }],
	noteBy							: { type: Schema.Types.ObjectId, ref: 'User' },
	createby                        :  { type: Schema.Types.ObjectId, ref: 'User' },
	createOn						: { type: Date, default: Date.now },
	desc								: { type: String },
	externalLink				: { type: String },
	attachment					: [{ type: String }]

});

//var User = mongoose.model('User', userSchema);

module.exports = mongoose.model('keynotes', keynoteSchema);