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

module.exports = mongoose.model('Program', ProgramSchema)
