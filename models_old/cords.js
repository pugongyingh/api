'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LogSchema = new Schema({
  type: String,
  date: {
    type: Date,
    default: Date.now
  },
  staff: String,
  note: String
});

var CordSchema = new Schema({
  id: {
    type: String,
    Required: 'Kindly enter the CRD ID for this cord'
  },
  owner: String,
  room: String,
  length: String,
  a: String,
  b: String,
  brand: String,
  price: String,
  date_added: {
    type: Date,
    default: Date.now
  },
  date_bought: {
    type: Date,
    default: Date.now
  },
  borrowed: Boolean,
  date_borrowed: {
    type: Date,
    default: Date.now
  },
  date_returned: {
    type: Date,
    default: Date.now
  },
  log: [LogSchema]
});

CordSchema.index({ id: 1, type: -1 });

module.exports = mongoose.model('Cords', CordSchema);
