const mongoose = require('mongoose')
const Schema = mongoose.Schema

const OtherSchema = new Schema({
  desc: String,
  need: {
    type: Date,
    Required: 'Please indicate when this item is required.'
  }
})

module.exports = mongoose.model('Other', OtherSchema)
