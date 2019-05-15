const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ErrorSchema = new Schema({
  kind: {
    type: String,
    enum: ['Start Up / Boot', 'Monitor / Display', 'Microsoft Office', 'Email / Internet', 'Remote Desktop', 'Phone', 'Laptop / Mobile', 'Other']
  },
  desc: String,
  start: {
    type: Date,
    Required: 'Please indicate when this issue began.'
  },
  tried: [{
		type: String,
		enum: ['Turning it off and on', 'Checked for updates', 'Connected to NCSU or EDURoam WIFI (if internet issue)', 'Other']
	}]
})

module.exports = mongoose.model('Error', ErrorSchema)
