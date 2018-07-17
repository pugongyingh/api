module.exports = function(app) {
  const users = require('../controllers/users')
  const mongoose = require('mongoose')
  const Inventory = mongoose.model('Inventory')
  const Computer = mongoose.model('Computer')
  const User = mongoose.model('User')
  const jwt = require('jsonwebtoken')
  const computers = require('../controllers/computers')
	const inventory = require('../controllers/inventory')
  const passport = require('passport')
  const cors = require('cors')

    //  cords = require('../controllers/cords'),
    //  misc = require('../controllers/misc'),
    //  tickets = require('../controllers/tickets'),
    //  passportService = require('../config/passport'),
    //  passport = require('passport')

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

  app.route('/login')
    .post(users.login_user)

  app.route('/comp')
    .get(computers.list_computers)
    .post(computers.create_computer)
  /*  .delete(function(req, res) {
      Computer.remove({}, function(err, computer) {
        if (err) {
          return res.status(500).send({status: "Error"})
        }
        return res.status(200).send({status: "All Computers Removed"})
      })
    }) */

    app.use(function (err, req, res, next) {
        let error = {}
        if (err.name === "MongoError") {
          switch (err.code) {
            case 11000:
              console.log('11000')
              return res.status(409).send({
                success: false,
                error: err,
                msg: 'This ID is already in use. Please confirm that the item you are adding does not already exist, or choose a different ID.'
              })
              break
            default:
              console.log('default')
              return res.status(500).send({
                success: false,
                error: err,
                msg: "Sorry, MongoDB encountered an error. " + err
              })
          }
        } else {
          console.log(err)
          return res.status(500).send({
            success: false,
            error: err,
            msg: "Sorry, something's gone wrong. " + err
          })
        }
    })

}
/*
  //require('../config/passport')(passport)
  const requireAuth = passport.authenticate('jwt', {session: false});
  const requireLogin = passport.authenticate('local', {session: false});

	// Inventory Base Routes
	app.route('/')
		.get(function(req, res) {
    	return res.status(200).send({status: "running"})
    });
	app.route('/inv')
		.get(inventory.list_all_inventory);

  app.route('/inv/:id')
    .put(inventory.update_equipment)
    .delete(inventory.delete_equipment);

  // Computer Routes
  app.route('/inv/computers')
    .get(computers.list_all_computers)
		.post(computers.create_a_computer);

  app.route('/inv/computers/:computerId')
    .get(computers.view_a_computer)
    .put(computers.update_a_computer);
/*
  // Cord Routes
  app.route('/inv/cords')
    .get(cords.list_all_cords)
    .post(cords.create_a_cord);

  app.route('/inv/cords/:cordId')
    .get(cords.view_a_cord)
    .put(cords.update_a_cord)
    .delete(cords.delete_a_cord);

  // Misc Routes
  app.route('/inv/misc')
    .get(misc.list_all_misc)
    .post(misc.create_a_misc);

  app.route('/inv/misc/:miscId')
    .get(misc.view_a_misc)
    .put(misc.update_a_misc)
    .patch(misc.update_a_misc)
    .delete(misc.delete_a_misc);

  // Ticket Routes
  app.route('/tickets')
    .get(tickets.list_all_tickets)
    .post(tickets.create_a_ticket);

  app.route('/tickets/:ticketId')
    .get(tickets.view_a_ticket)
    .put(tickets.update_a_ticket)
    .delete(tickets.delete_a_ticket);

  // User Routes
  app.route('/users')
    .get(users.list_all_users )
    .post(users.create_a_user);

  app.route('/users/:userId')
    .get(users.view_a_user)
    .put(users.update_a_user)
    .delete(users.delete_a_user);

  app.route('/users/:userId/inv')
    .get(inventory.list_user_inventory);

  app.route('/users/:userId/computers')
    .get(computers.list_user_computers);
/*
  app.route('/users/:userId/cords')
    .get(cords.list_user_cords);

  app.route('/users/:userId/misc')
    .get(misc.list_user_misc);

  app.route('/login')
    .post(requireLogin, users.login_a_user);
};
*/
