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

var MiscSchema = new Schema({
  id: {
    type: String,
    Required: 'Kindly enter the MSC ID for this item'
  },
  owner: String,
  room: String,
  kind: String,
  model: String,
  power: String,
  price: String,
  size: String,
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

MiscSchema.index({ id: 1, type: -1 });

module.exports = mongoose.model('Misc', MiscSchema);
