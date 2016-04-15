'use strict';

var mongoose = require('mongoose')
, Schema = mongoose.Schema;

var userSchema = require('./user');

var teaserSchema = new mongoose.Schema({

  title 				: { type: String, trim: true, required: true },
  teaser				: { type: String, trim: true, required: true },
  type                	: { type: String, trim: true, required: true }, // video/audio/text
  teaserText          	: { type: String, trim: true },
  externalLink        	: [{ type: String, trim: true }],
  tags					: [],
  createdBy				: { type: Schema.Types.ObjectId, ref: 'User' },
  createOn				: { type: Date, default: Date.now },

});

//var User = mongoose.model('User', userSchema);

module.exports = mongoose.model('teasers', teaserSchema);
