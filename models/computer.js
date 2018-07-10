const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ComputerSchema = new Schema({
  brand: String,
  model: String,
  type: String,
  hd: String,
  ram: String,
  cpu: String,
  price: String
})

module.exports = mongoose.model('Computer', ComputerSchema)
