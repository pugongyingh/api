const nodemailer = require('nodemailer')
const mongoose = require('mongoose')
const User = mongoose.model('User')
const {google} = require('googleapis');

const generator = require('xoauth2').createXOAuth2Generator({
  user: "itre-information@ncsu.edu",
  clientId: "888434420125-fnavncse1apj7ovluvmfg9brh2bu8fks.apps.googleusercontent.com",
  clientSecret: "HwwgJdpH-DbJ73KbBrh_FrTU",
  refreshToken: "1/crhXwSm-mY0bMetECS-ty_RIEjybcuCrd8IFNO3q8hY"
})

const smtpTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    xoauth2: generator
  }
})

exports.send_password = function(req, res, next) {
  oauth2Client.getToken(code, (err, token) => {
    if (err) {
      err.note='Failed to retrieve oauth token'
      return next(err)
    } else {
      oauth2Client.setCredentials(token)
    }
  })

  const gmail = google.gmail({
    version: 'v1',
    auth: oauth2Client,
  })

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
        err.note='Failed to find or update user'
        return next(err)
      } else {
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
  const mailOptions = {
    from: "itre-information@ncsu.edu",
    to: "drcremin@ncsu.edu",
    subject: "Hello",
    generateTextFromHTML: true,
    html: "<b>Hello world</b>"
  };

  smtpTransport.sendMail(mailOptions, function(error, response) {
    if (error) {
      return next(error)
    } else {
      return res.status(200).send({success: true, data: response})
    }
  })
}
