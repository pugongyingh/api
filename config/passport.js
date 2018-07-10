const passport = require('passport'),
      Users = require('../models/user'),
      config = require('./database'),
      JwtStrategy = require('passport-jwt').Strategy,
      ExtractJwt = require('passport-jwt').ExtractJwt,
      LocalStrategy = require('passport-local');

passport.use( new LocalStrategy(
  {},
  (username, password, done) => {
    Users.findOne({ username: username }, (err, user) => {
      if(err) {
        return done({ error: 'Not Found.' })
      } else if(!user) {
        return done(null, false, {
          error: 'Your login details could not be verified. Please try again.'
        })
      } else {
        user.comparePassword(password, (err, isMatch) => {
          if (err) {
            return done({
              error: 'password error.'
            })
          } else if (!isMatch) {
            return done(null, false, {
              error: "Your password is incorrect. Please check your spelling and try again."
            })
          } else {
            return done(null, user);
          }
        })
      }
    })
  }
))

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('JWT'),
  secretOrKey: config.secret
};

const jwtLogin = new JwtStrategy(jwtOptions, function(auth, done) {
  Users.findOne({"username": auth.user}, function(err, user) {
    if (err) {
      return done(err, false);
    } else if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  });
});

passport.use(jwtLogin)
