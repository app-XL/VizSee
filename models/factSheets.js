'use strict';

var mongoose             = require('mongoose')
  , Schema               = mongoose.Schema;

var userSchema           = require('./user');
var cityFactSchema       = require('./cityFacts');

var factSheetSchema = new mongoose.Schema({

  title               : { type: String, trim: true, required: true },
  logoLink            : { type: String, trim: true},
  address             : { type: Object, required: true },
  strength            : { type: Number },

  locations           : [{
    name              : { type: String, trim: true, required: true },
    city              : { type: Schema.Types.ObjectId, ref: 'city_facts', required: true },
    address           : { type: Object, required: true },
    strength          : { type: Number },

      facilities        : [{
        name            : { type: String, trim: true, required: true },
        address         : { type: String, trim: true },
        type            : { type: String, trim: true },
        strength        : { type: Number }
        }],
  }],

  editdBy            : { type: Schema.Types.ObjectId, ref: 'User' },
  editeOn            : { type: Date, default: Date.now },

});

module.exports = mongoose.model('fact_sheets', factSheetSchema);
