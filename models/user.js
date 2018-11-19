const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const Schema = mongoose.Schema

const UserSchema = new Schema({
  username: {
    type: String,
    unique: true,
    Required: 'Please enter your Unity ID'
  },
  password: {
    type: String,
    Required: 'Please enter a memorable password'
  },
  role: {
    type: String,
    default: 'Staff'
  },
  email: String,
  phone: String,
  first: String,
  last: String,
  program: {type: Schema.Types.ObjectId, ref: 'Program'},
  super: {type: Schema.Types.ObjectId, ref: 'User'},
  room: String
})

var autoPopulateInfo = function(next) {
  this.populate('super');
  this.populate('program');
  next();
}

UserSchema.
  pre('findOne', autoPopulateInfo).
  pre('find', autoPopulateInfo)

UserSchema.pre('save', function(next)  {
  let user = this
  bcrypt.genSalt(10, function(err, salt) {
    if (err) {
      return next(err)
    } else {
      bcrypt.hash(user.password, salt, function(error, hash) {
        if (error) {
          return next(error)
        } else {
          user.password = hash
          next()
        }
      })
    }
  })
})

UserSchema.pre("update", function(next) {
  const password = this.getUpdate().$set.password
  if (!password) {
    return next()
  }
  try {
    const salt = bcrypt.genSaltSync()
    const hash = bcrypt.hashSync(password, salt)
    this.getUpdate().$set.password = hash
    next()
  } catch (error) {
    return next(error)
  }
})

UserSchema.methods.comparePassword = function (passw, cb) {
    bcrypt.compare(passw, this.password, function (err, isMatch) {
        if (err) { return cb(err) }
        cb(null, isMatch)
    })
}

UserSchema.index({ username: 1 }, { unique: true })

module.exports = mongoose.model('User', UserSchema)
