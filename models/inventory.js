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
  cams: String,
  bought: Date,
  added: {
    type: Date,
    default: Date.now
  },
  updated: Date,
  project: String,
  program_id: String,
  user_id: String,
  available:  {
    type: Boolean,
    default: true
  },
  borrowed: Date,
  returned: Date,
  kind: {
		type: String,
		enum: ['Computer', 'Cord', 'Accessory']
	},
  item: {type: Schema.Types.ObjectId, refPath: 'kind'},
  location: String,
  log: [LogSchema]
},
{ toJSON: { virtuals: true }, toObject: { virtuals: true }})

InventorySchema.virtual('program', {
ref: 'Program',
localField: 'program_id',
foreignField: 'code',
justOne: true
})

InventorySchema.virtual('user', {
  ref: 'User',
  localField: 'user_id',
  foreignField: 'username',
  justOne: true
})

var autoPopulateInfo = function(next) {
  this.populate('user');
  this.populate('program');
  next();
}

InventorySchema.
  pre('findOne', autoPopulateInfo).
  pre('find', autoPopulateInfo).
  pre('findOneAndUpdate', autoPopulateInfo).
  pre('update', autoPopulateInfo)

InventorySchema.index({ itreID: 1 }, { unique: true })

module.exports = mongoose.model('Inventory', InventorySchema)
