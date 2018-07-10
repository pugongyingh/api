const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CordSchema = new Schema({
  brand: String,
  type: String,
  a: String,
  b: String,
  c: String,
  length: String,
  price: String
})

module.exports = mongoose.model('Cord', CordSchema)
