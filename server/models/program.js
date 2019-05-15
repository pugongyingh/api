const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ProgramSchema = new Schema({
  code:  {
    type: String,
    unique: true
  },
  name: String,
  director: String
})

ProgramSchema.index({ code: 1 }, { unique: true })
module.exports = mongoose.model('Program', ProgramSchema)
