module.exports = function(app) {
  const mongoose = require('mongoose')
  const Inventory = mongoose.model('Inventory')
  const Computer = mongoose.model('Computer')
  const User = mongoose.model('User')
  const Program = mongoose.model('Program')
  const jwt = require('jsonwebtoken')
	const inventory = require('../controllers/inventory')
	const tickets = require('../controllers/tickets')
  const users = require('../controllers/users')
	const program = require('../controllers/program')
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

  app.route('/programs')
    .get(program.list_program)
    .post(program.new_program)

  app.route('/user')
    .get(users.list_users)
    .post(users.create_user)

  app.route('/user/:id')
    .get(users.view_user)
    .put(users.update_user)
    .delete(users.delete_user)

  app.route('/me/inv')
    .get(inventory.list_user_inventory)

  app.route('/me/tickets')
    .get(tickets.list_user_tickets)

  app.route('/login')
    .post(users.login_user)

  app.route('/tickets')
    .get(tickets.list_tickets)
    .post(tickets.new_request)

  app.route('/tickets/:id')
    .get(tickets.get_ticket)
    .put(tickets.edit_ticket)
    .delete(tickets.delete_tickets)

/* Error Handler */
  app.use(function (err, req, res, next) {
    console.log(err)

    switch (err.name) {
      case 'MongoError':
        if (err.code === 11000) {
          return res.status(409).send({
            success: false,
            error: err,
            msg: 'This ID is already in use. Please confirm that the item you are adding does not already exist, or choose a different ID.'
          })
        } else {
          return res.status(500).send({
            success: false,
            error: err,
            msg: "MongoDB encountered an error. " + err
          })
        }
        break;
      case 'CastError':
        return res.status(406).send({
          success: false,
          error: err,
          msg: "This ID does not match any registered user. Please double check the Json Web Token payload."
        })
        break;
      case 'Missing':
        return res.status(400).send({
          success: false,
          error: err,
          msg: "This request was missing a parameter"
        })
        break;
      default:
        return res.status(500).send({
          success: false,
          error: err,
          msg: "Sorry, something's gone wrong. " + err
        })
    }
  })
}
