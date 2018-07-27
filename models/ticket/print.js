const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PrintSchema = new Schema({
  path: String,
  size: String,
  special: String,
  need: {
    type: Date,
    Required: 'Please indicate when this item is required.'
  }
})

module.exports = mongoose.model('Print', PrintSchema)
