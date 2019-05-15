const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AccessSchema = new Schema({
  kind: {
    type: String,
    enum: ['Folder / Server', 'Software Install', 'Room', 'Other']
  },
  location: String,
  desc: String,
  need: {
    type: Date,
    Required: 'Please indicate when this access is required.'
  }
})

module.exports = mongoose.model('Access', AccessSchema)
