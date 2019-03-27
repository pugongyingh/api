const mongoose = require('mongoose')
const Schema = mongoose.Schema

const NoteSchema = new Schema({
  type: String,
  date: {
    type: Date,
    default: Date.now
  },
  staff: String,
  note: String
})

const TicketSchema = new Schema({
  user_id: {
    type: String,
    Required: 'Please enter the ID of the user or department who needs this issue resolved'
  },
  requestor_id: {
    type: String,
    Required: 'Please enter the ID of the user who requested this issue ticket'
  },
  added: {
    type: Date,
    default: Date.now
  },
  priority: {
    type: String,
    default: 'Normal',
		enum: ['Low', 'Normal', 'Medium', 'High', 'Urgent']
  },
  status: {
    type: String,
    default: 'New',
		enum: ['New', 'Seen', 'In Progress', 'On Hold', 'Awaiting Reply', 'Completed', 'Closed', 'Reopened']
  },
  tried: [String],
  kind: {
		type: String,
		enum: [ 'Access', 'Equipment', 'Error', 'Print', 'NewUser', 'Borrow', 'Other']
	},
  info: {type: Schema.Types.ObjectId, refPath: 'kind'},
  log: [NoteSchema]
},
{ toJSON: { virtuals: true }, toObject: { virtuals: true }})

TicketSchema.virtual('requestor', {
  ref: 'User',
  localField: 'requestor_id',
  foreignField: 'username',
  justOne: true
})

TicketSchema.virtual('for', {
  ref: 'User',
  localField: 'user_id',
  foreignField: 'username',
  justOne: true
})

var autoPopulateInfo = function(next) {
  this.populate('requestor');
  this.populate('for');
  next();
}

TicketSchema.
  pre('findOne', autoPopulateInfo).
  pre('find', autoPopulateInfo).
  pre('findOneAndUpdate', autoPopulateInfo).
  pre('update', autoPopulateInfo)

module.exports = mongoose.model('Ticket', TicketSchema)
