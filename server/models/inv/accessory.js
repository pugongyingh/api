const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AccessorySchema = new Schema({
  brand: String,
  model: String,
  type: String,
  serial: String,
  power: String,
  size: String,
  price: String
})

module.exports = mongoose.model('Accessory', AccessorySchema)
