const mongoose = require('mongoose')
const Schema = mongoose.Schema

const LogSchema = new Schema({
  type: String,
  date: {
    type: Date,
    default: Date.now
  },
  staff: String,
  note: String
})

const InventorySchema = new Schema({
  itreID:  {
    type: String,
    unique: true,
    Required: 'Kindly enter the ITRE ID'
  },
  serial: String,
  bought: Date,
  added: {
    type: Date,
    default: Date.now
  },
  updated: Date,
  project: String,
  owner: {type: Schema.Types.ObjectId, ref: 'User'},
  available: Boolean,
  borrowed: Date,
  returned: Date,
  kind: {
		type: String,
		enum: ['Computer', 'Cord', 'Accessory']
	},
  item: {type: Schema.Types.ObjectId, refPath: 'kind'},
  location: String,
  log: [LogSchema]
})

InventorySchema.index({ itreID: 1 }, { unique: true })

module.exports = mongoose.model('Inventory', InventorySchema)
