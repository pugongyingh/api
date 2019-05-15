const nodemailer = require('nodemailer')
const googleAuth = require('google-auth-library')
const {auth} = require('google-auth-library')

const mongoose = require('mongoose')
const User = mongoose.model('User')

const scope= "https://mail.google.com/"

const credentials = {
  "client_id": "888434420125-fnavncse1apj7ovluvmfg9brh2bu8fks.apps.googleusercontent.com",
  "project_id": "ticketing-223113","auth_uri":"https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://www.googleapis.com/oauth2/v3/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_secret": "HwwgJdpH-DbJ73KbBrh_FrTU",
  "redirect_uris": ["https://developers.google.com/oauthplayground"]
}

async function main() {
  const oauth2Client = new googleAuth.OAuth2Client(
    credentials.client_id,
    credentials.client_secret,
    credentials.redirect_uris[0]
  )
  oauth2Client.setCredentials({
     refresh_token: "1/QIADSwWuTKu0Awk1iS0NHP5S0xKItzIiJ7J3WXzuKSE"
  });
  const tokens = await oauth2Client.getAccessToken()
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: "itre-information@ncsu.edu",
      accessToken: tokens.token
    }
  })
}

exports.send_email = function(req, res, next) {
  main()
  .then(response => {
    const transport = response
    const resetToken =  Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    User.findOneAndUpdate(
      {$or: [
          {"username": req.body.username},
          {"email": req.body.email}
      ]},
      {$set: {resetPasswordToken: resetToken, resetPasswordExpires: Date.now() + 3600000}},
      {new: true})
  	.exec(function(err, user) {
  		if (err) {
        err.name= 'UpdateError'
  			return next(err)
  		} else if (user === null) {
        return next({name:'NoUser'})
  		} else {
        const mailOptions = {
              from: "itre-information@ncsu.edu",
              to: user.email,
              subject: "Password Reset",
              generateTextFromHTML: true,
              html: `You are recieving this email because you requested a reset of your password.
              <br />
              <strong><em>If you did not request this email, please contact your administrator immediately.</e></strong>
              <br /><br />
              Click the link below to reset your password.
              <br /><br />
              <a href="http://localhost:3000/recover/${resetToken}">http://localhost:3000/recover/${resetToken}</a>`
            }
        transport.sendMail(mailOptions, function(error, response) {
          if (error) {
            return next(error)
          } else {
            return res.status(200).send({success: true, msg: "An email has been sent to your address."})
          }
        })
  		}
    })
  })
  .catch(err => {
    err.name = 'Mail'
    return next(err)
  })

}
