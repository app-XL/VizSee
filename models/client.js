'use strict';

var mongoose = require('mongoose')
, Schema = mongoose.Schema;

var clientSchema = new mongoose.Schema({

	name 							: { type: String, trim: true, required: true },
	vertical						: { type: String, trim: true, required: true },
	profile							: { type: String, trim: true, required: true },
	logo							: { type: String, trim: true },
	createOn						: { type: Date, default: Date.now },
	competitors 					: [{ type: String, trim: true }],
	regions 						: [{ type: String, trim: true, required: true }],
	offerings 						: [{ type: String, trim: true }],
	cscPersonnel					: {
		salesExec					: { type: Schema.Types.ObjectId, ref: 'User', required: true },
		accountGM					: { type: Schema.Types.ObjectId, ref: 'User', required: true },
		industryExec				: { type: Schema.Types.ObjectId, ref: 'User', required: true },
		globalDelivery				: { type: Schema.Types.ObjectId, ref: 'User', required: true },
		cre 						: { type: Schema.Types.ObjectId, ref: 'User', required: true },
	},
	netPromoterScore				: { type: Number }
	
});

module.exports = mongoose.model('clients', clientSchema);