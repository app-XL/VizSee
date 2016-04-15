'use strict';

var mongoose = require('mongoose')
	, Schema = mongoose.Schema;

var userSchema = require('./user');

var cityFactSchema = new mongoose.Schema({

  	name: 				{ type: String, trim: true, required: true },
  	desc: 				{ type: String, trim: true, required: true },
	bannerLink: 		{ type: String, trim: true },
  	geospot: 			{ type: [Number], index: '2dsphere'},

	places : [{
		name: 			{ type: String, trim: true, required: true },
		desc: 			{ type: String, trim: true, required: true },
		imageLinks: 	[{ type: String, trim: true }],
		geospot: 		{type: [Number], index: '2dsphere'},
		quickFacts: 	[{type: String, trim: true }],
	}],

  quickFacts: 			[{type: String, trim: true }],

  editBy: 				{ type: Schema.Types.ObjectId, ref: 'User' },
  editOn: 				{ type: Date, default: Date.now }
});

module.exports = mongoose.model('city_facts', cityFactSchema);
