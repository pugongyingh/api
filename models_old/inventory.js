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
	user: String,
	ip: String,
	os: String,
	serial: String,
	mac: String,
	cams: String,
	hd: String,
	ram: String,
	maintenance: {
		type: Date,
		default: Date.now
	},
	warranty: {
		type: Date,
		default: Date.now
	}
});

var CordSchema = new Schema({
  length: String,
  a_con: String,
  b_con: String
});

var MiscSchema = new Schema({
  kind: String,
  size: String,
  power: String
});

var ItemSchema = new Schema({
  id: {
    type: String,
    Required: 'Kindly enter the ITRE ID'
  },
  date_bought: Date,
  location: String,
  brand: String,
  desc: String,
  price: String,
  project: String,
  borrowed: Boolean,
  date_borrowed: Date,
  date_returned: Date,
});

var InventorySchema = new Schema({
  date_added: Date,
  date_updated: Date,
	type: {
		type: String,
		enum: ['computer', 'cord', 'misc']
	},
	owner: String,
  item: ItemSchema,
  computer: ComputerSchema,
  cord: CordSchema,
  misc: MiscSchema,
  log: [LogSchema]
});

InventorySchema.index({ id: 1, type: -1 });

module.exports = mongoose.model('Inventory', InventorySchema);
