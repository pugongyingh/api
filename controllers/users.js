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

exports.list_users = function(req, res) {
  User.find({}, function(err, users) {
		if (err) {
			return res.status(500).send({success: false, msg: err})
		} else if (users === null) {
			return res.status(204).send({success: true, msg: "No users are currently registered."})
		} else {
			return res.status(200).send({success: true, users: users})
		}
  })
}

exports.create_user = function(req, res) {
	if (req.body === null || !req.body) {
		return res.status(400).send({success: false, msg: "No user data was submitted", data: req.body})
	} else {
    let new_doc = new User(req.body)
    new_doc.save(function(err, doc) {
      if (err) {
        return res.status(500).send({success: false, msg: err});
      }
      return res.status(201).send({success: true, data: doc});
    })
	}
}

exports.view_user = function(req, res) {
  User.findOne({"username": req.params.userId}, function(err, user) {
		if (err) {
			return res.status(403).send({success: false, msg: err})
		} else if (user === null) {
			return res.status(404).send({success: false, msg: "That user does not exist."})
		} else {
			return res.status(200).send({success: true, data: user})
		}
  })
}

exports.update_user = function(req, res) {
  User.findOneAndUpdate({
    "username": req.params.userId
  }, {$set: req.body}, {new: true},
  function(err, user) {
		if (err) {
			return res.status(403).send({success: false, msg: err})
		} else if (user === null) {
			return res.status(404).send({success: false, msg: "That user does not exist."})
		} else {
			return res.status(200).send({success: true, data: user})
		}
  })
}

exports.delete_user = function(req, res) {
  User.remove({
    "username": req.params.userId
  }, function(err, user) {
    if (err)
      res.send(err)
    res.json({ message: 'User successfully deleted' })
  })
}

exports.login_user = function(req, res) {
  passport.authenticate('local', {session: false}, (err, user, info) => {
    if (err || !user) {
      return res.status(400).json({error: info.error})
    } else {
      req.login(user, {session: false}, (err) => {
        if (err) {
          return res.status(403).send({success: false, msg: err})
        }
        const token = jwt.sign({
          username: req.user.username,
          role: req.user.role,
          first: req.user.first,
          last: req.user.last,
          id: req.user._id
        }, config.secret, {
          expiresIn: '30m'
        })
        return res.status(200).send({
          success: true,
          message: "Successfully logged in.",
          token: token,
          user:{
            username: req.user.username,
            role: req.user.role,
            first: req.user.first,
            last: req.user.last,
            id: req.user._id
          }
        })
      })
    }
  })(req, res)
}

exports.roleAuthorization = function(roles) {
  return function(req, res, next) {
    let user = req.user
    User.findOne({"username": req.params.userId}, function(err, foundUser) {
      if (err) {
        res.status(422).json({error: 'No user found.'})
        return next(err)
      } else {

      }
      return next('good!')
    })
  }
}
