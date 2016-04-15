'use strict';

var mongoose = require('mongoose')
	, Schema = mongoose.Schema;

var addressSchema = new mongoose.Schema({
		street: 	{ type: String, trim: true },
		city: 		{ type: String, trim: true, required: true },
		country: 	{ type: String, trim: true, required: true },
		zip: 		{ type: String, trim: true, required: true }
});

module.exports = mongoose.model('address', addressSchema);
