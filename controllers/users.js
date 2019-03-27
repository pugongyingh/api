const mongoose = require('mongoose')
const User = mongoose.model('User')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const config = require('../config/database')
const passportService = require('../config/passport')
const passport = require('passport')
const cookieParser = require('cookie-parser')

function generateToken(user) {
  return jwt.sign(user, config.secret, {
    expiresIn: '30m'
  })
}

exports.list_users = function(req, res, next) {
  User.find({})
    .exec(function(err, doc) {
      if (err) {
        err.name = 'NoUser'
	      return next(err)
      }
      return res.status(200).send({success: true, data: doc})
  })
}

exports.create_user = function(req, res, next) {
	if (req.body === null || !req.body) {
    return next({name:'Missing'})
	} else {
    let new_doc = new User(req.body)
    new_doc.populate('super').populate('program').execPopulate()
    new_doc.save(function(err, doc) {
      if (err) {
        return next(err)
      } else {
        return res.status(201).send({success: true, data: doc})
      }
    })
	}
}
}

exports.view_user = function(req, res, next) {
  User.findOne({"username": req.params.id})
	.exec(function(err, user) {
		if (err) {
      err.name = 'NoUser'
			return next(err)
		} else if (user === null) {
      return next({name:'NoUser'})
		} else {
			return res.status(200).send({success: true, data: user})
		}
  })
}

exports.update_user = function(req, res, next) {
  User.findOneAndUpdate({
    "username": req.params.id
  }, {$set: req.body}, {new: true})
	.exec(function(err, user) {
		if (err) {
      err.name = 'UpdateError'
			return next(err)
		} else if (user === null) {
      return next({name:'NoUser'})
		} else {
			return res.status(200).send({success: true, data: user})
		}
  })
}

exports.delete_user = function(req, res, next) {
  if (req.params.id === 'all') {
    User.remove({}, function(err, user) {
      if (err) {
  			return next(err)
  		}
      res.json({ message: 'All Users Successfully Deleted' })
    })
  } else {
    User.remove({
      "username": req.params.id
    }, function(err, user) {
      if (err) {
  			return next(err)
  		}
      res.json({ message: 'User successfully deleted' })
    })
  }


exports.reset_password = function(req, res, next) {
  User.findOneAndUpdate({
    "resetPasswordToken": req.body.token,
    "resetPasswordExpires": { $gt: Date.now() }  // if expires > now,  the token is still good
  }, {$set: {
    password: req.body.password,
    resetPasswordToken: undefined,
    resetPasswordExpires: undefined
  }}, {new: false})
	.exec(function(err, user) {
		if (err) {
      err.name = 'UpdateError'
			return next(err)
		} else if (user === null) {
      return next({name:'ResetNotValid'})
		} else {
			return res.status(200).send({success: true, data: user})
		}
  })
}

exports.roleAuthorization = function(roles) {
  return function(req, res, next) {
    let user = req.user
    User.findOne({"username": req.params.id}, function(err, foundUser) {
      if (err) {
        return next({name:'NoUser'})
        return next(err)
      } else {

      }
      return next('good!')
    })
  }
}
