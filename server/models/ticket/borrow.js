const mongoose = require('mongoose')
const Schema = mongoose.Schema

const BorrowSchema = new Schema({
  item: {type: Schema.Types.ObjectId, ref: 'Inventory'},
  request_date: Date,
  return_date: Date,
  info: String
})


module.exports = mongoose.model('Borrow', BorrowSchema)
