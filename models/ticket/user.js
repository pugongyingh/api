const mongoose = require('mongoose')
const Schema = mongoose.Schema

const NewUserSchema = new Schema({
  role: String,
  first: String,
  last: String,
  email: String,
  phone: String,
  program: String,
  super: {type: Schema.Types.ObjectId, ref: 'User'},
  room: String,
  account: String,
  start: {
    type: Date,
    Required: 'Please indicate when this person will start.'
  },
  access: String,
  software: [String],
  hardware: [String],
  other: String
})

module.exports = mongoose.model('NewUser', NewUserSchema)
