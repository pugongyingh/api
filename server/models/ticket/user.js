const mongoose = require('mongoose')
const Schema = mongoose.Schema

const NewUserSchema = new Schema({
  role: String,
  first: String,
  last: String,
  email: String,
  phone: String,
  program_id: String,
  super_id: String,
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
},
{ toJSON: { virtuals: true }, toObject: { virtuals: true }})

NewUserSchema.virtual('program', {
  ref: 'Program',
  localField: 'program_id',
  foreignField: 'code',
  justOne: true
})

NewUserSchema.virtual('super', {
  ref: 'User',
  localField: 'super_id',
  foreignField: 'username',
  justOne: true
})

var autoPopulateInfo = function(next) {
  this.populate('super');
  this.populate('program');
  next();
}

NewUserSchema.
  pre('findOne', autoPopulateInfo).
  pre('find', autoPopulateInfo).
  pre('findOneAndUpdate', autoPopulateInfo).
  pre('update', autoPopulateInfo)

module.exports = mongoose.model('NewUser', NewUserSchema)
