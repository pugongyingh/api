var mongoose = require('mongoose'),
    Ticket = mongoose.model('Tickets'),
    jwt = require('jsonwebtoken'),
    passport = require('passport')

//require('../config/passport')(passport)

var getToken = function (headers) {
  if (headers && headers.authorization) {
    var parted = headers.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};

exports.list_all_tickets = function(req, res) {
  var token = getToken(req.headers);
  if (token) {
    if (req.query.owner) {
      Ticket.findOne({"owner": req.query.owner}, function(err, ticket) {
        if (err)
          res.send(err);
        res.json(ticket);
      });

    } else {
      Ticket.find({}, function(err, ticket) {
        if (err)
          res.send(err);
        res.json(ticket);
      });
    }
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
};

exports.create_a_ticket = function(req, res) {
  var token = getToken(req.headers);
  if (token) {
    var new_ticket = new Ticket(req.body);
    new_ticket.save(function(err, ticket) {
      if (err)
        res.send(err);
      res.json(ticket);
    });
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
};

exports.view_a_ticket = function(req, res) {
  var token = getToken(req.headers);
  if (token) {
    Ticket.findOne({"_id": req.params.ticketId}, function(err, ticket) {
      if (err)
        res.send(err);
      res.json(ticket);
    });
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
};

exports.update_a_ticket = function(req, res) {
  var token = getToken(req.headers);
  if (token) {
    Ticket.findOneAndUpdate({"_id": req.params.ticketId}, {
      $set: {owner: req.body.owner,
      description: req.body.description,
      kind: req.body.kind,
      state: req.body.state,
      level: req.body.level},
      $push: {log: req.body.log}
    }, {new: true}, function(err, ticket) {
      if (err)
        res.send(err);
      res.json(ticket);
    });
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
};

exports.delete_a_ticket = function(req, res) {
  var token = getToken(req.headers);
  if (token) {
    Ticket.remove({
      "_id": req.params.ticketId
    }, function(err, ticket) {
      if (err)
        res.send(err);
      res.json({ message: 'Ticket successfully deleted' });
    });
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
};
