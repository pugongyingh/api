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

var ComputerSchema = new Schema({
  id: {
    type: String,
    Required: 'Kindly enter the ITRE ID for this computer'
  },
  serial: String,
  cams: String,
  owner: String,
  program: String,
  room: String,
  ip: String,
  mac: String,
  hd: String,
  model: String,
  brand: String,
  os: String,
  price: String,
  date_added: {
    type: Date,
    default: Date.now
  },
  date_bought: {
    type: Date,
    default: Date.now
  },
  warranty_date: {
    type: Date,
    default: Date.now
  },
  maintenance_date: {
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

ComputerSchema.index({ id: 1, type: -1 });

module.exports = mongoose.model('Computers', ComputerSchema);
