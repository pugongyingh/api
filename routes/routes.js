module.exports = function(app) {
  const users = require('../controllers/users')
  const mongoose = require('mongoose')
  const Inventory = mongoose.model('Inventory')
  const Computer = mongoose.model('Computer')
  const User = mongoose.model('User')
  const jwt = require('jsonwebtoken')
	const inventory = require('../controllers/inventory')
	const tickets = require('../controllers/tickets')
  const passport = require('passport')
  const cors = require('cors')

  app.route('/')
		.get(function(req, res) {
    	return res.status(200).send({status: "running"})
    })

  app.route('/inv')
    .get(inventory.list_inventory)
    .post(inventory.new_inventory)

  app.route('/inv/:id')
    .get(inventory.get_inventory)
    .put(inventory.update_inventory)
    .delete(inventory.delete_inventory)

  app.route('/user')
    .get(users.list_users)
    .post(users.create_user)

  app.route('/user/:id')
    .get(users.list_users)

  app.route('/me/inv')
    .get(inventory.list_user_inventory)

  app.route('/me/tickets')
    .get(tickets.list_user_tickets)

  app.route('/login')
    .post(users.login_user)

  app.route('/tickets')
    .get(tickets.list_tickets)
    .post(tickets.new_request)
    .delete(tickets.delete_tickets)

/* Error Handler */
  app.use(function (err, req, res, next) {
    console.log(err)
    if (err.name === "MongoError") {
      switch (err.code) {
        case 11000:
          return res.status(409).send({
            success: false,
            error: err,
            msg: 'This ID is already in use. Please confirm that the item you are adding does not already exist, or choose a different ID.'
          })
          break
        default:
          return res.status(500).send({
            success: false,
            error: err,
            msg: "Sorry, MongoDB encountered an error. " + err
          })
      }
    } else if (err.name === "Missing") {
      return res.status(400).send({
        success: false,
        error: err,
        msg: "This request was missing a parameter"
      })
    } else if (err.name === "CastError") {
      return res.status(406).send({
        success: false,
        error: err,
        msg: "This ID does not match any registered user. Please double check the Json Web Token payload."
      })
    } else {
      return res.status(500).send({
        success: false,
        error: err,
        msg: "Sorry, something's gone wrong. " + err
      })
    }
  })

}
