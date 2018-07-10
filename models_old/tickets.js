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

var TicketSchema = new Schema({
  owner: String,
  description: String,
  kind: String,
  state: String,
  level: String,
  date_added: {
    type: Date,
    default: Date.now
  },
  log: [LogSchema]
});


module.exports = mongoose.model('Tickets', TicketSchema);
