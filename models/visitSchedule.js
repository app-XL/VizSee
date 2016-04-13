'use strict';

var mongoose = require('mongoose')
	, Schema = mongoose.Schema;

var userSchema 				= require('./user');
var clientSchema 			= require('./client');
var visitSchema 			= require('./visit');
var feedbackDefSchema	= require('./feedbackDef');

var visitScheduleSchema = new mongoose.Schema({
    	client 							: { type: Schema.Types.ObjectId, ref: 'clients' },
	visit							: { type: Schema.Types.ObjectId, ref: 'visits' },
	scheduleDate						: { type: Date },
	session							: {
		type						: { type: String }, //presentation, discussion, tea, lunch, dinner, floor-walk
		startTime					: { type: Date},
		endTime						: { type: Date},
		title						: { type: String },
		location					: { type: String },
		desc						: { type: String },
		owner						: { type: Schema.Types.ObjectId, ref: 'User' },
		supporter					: { type: Schema.Types.ObjectId, ref: 'User' }
	},
	invitees						: [{ type: Schema.Types.ObjectId, ref: 'User' }],
	feedbackTemplate		: { type: Schema.Types.ObjectId, ref: 'feedbackDefs',required: false }

});

module.exports = mongoose.model('visit_schedules', visitScheduleSchema);
