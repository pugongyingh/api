const mongoose = require('mongoose')
const Schema = mongoose.Schema

const EquipmentSchema = new Schema({
  budget: String,
  account: {
    type: String,
    Required: 'A request cannot be fulfilled without an account number.'
  },
  need: {
    type: Date,
    Required: 'Please indicate when this item is required.'
  },
  type: String,
  desc: String,
})

module.exports = mongoose.model('Equipment', EquipmentSchema)
