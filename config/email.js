const nodemailer = require('nodemailer')
const mongoose = require('mongoose')
const User = mongoose.model('User')
const generator = require('xoauth2').createXOAuth2Generator({
      user: 'itre-information@ncsu.edu',
      clientId: '711238963896-i8fcn9dat5j62dbel1f4cdvul8in4fsb.apps.googleusercontent.com',
      clientSecret: 'rEMPIH-beN3aQIO8GnRE0yOZ',
      scope: 'https://mail.google.com/',
      refreshToken: '1/BAAlCKXFPfDQijrNuBFUe_kIR1ry9uflkHe-mocZmaI',
      accessToken: 'ya29.Ci9rA_rVi7kb5m1okV86reMjSaU5o-rIGYgwYim8bXNMVGxaco5jQM6EY_pdau4E1Q'
    })

const transport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
      xoauth2: generator
  }
})


exports.send_password = function(req, res, next) {
  let userInfo
  const tempPass = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  if (req.body.username) {
    User.findOneAndUpdate(
      {"username": req.body.username},
      {$set: {
        password: tempPass
      }}
    )
    .exec(function(err, userInfo) {
      if (err) {
        return next(err)
      } else {
        transport.sendMail({
          from: 'ITRE Ticketing <itre-information@ncsu.edu>',
          to: `${userInfo.email}`,
          text: 'HI'
        }, function(err, res) {
          if (err) {
            return next(err)
          } else {
      			return res.status(200).send({success: true})
          }
        })
      }
    })
  } else if (req.body.email) {
    User.findOneAndUpdate(
      {"email": req.body.email},
      {$set: {
        password: tempPass
      }}
    )
    .exec(function(err, foundUser) {
      if (err) {
        return next(err)
      } else {
        userInfo = foundUser
      }
    })
  } else {
    return next({name:'Missing'})
  }
}

exports.test_email = function(req, res, next) {
  transport.verify(function(error, success) {
    if (error) {
      res.status(500).send({success: false, error:error})
    } else {
      return res.status(200).send({success: true})
    }
  })
}
