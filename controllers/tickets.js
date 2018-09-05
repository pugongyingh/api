const mongoose = require('mongoose')
const Ticket = mongoose.model('Ticket')
const Access = mongoose.model('Access')
const Equipment = mongoose.model('Equipment')
const Error = mongoose.model('Error')
const Print = mongoose.model('Print')
const NewUser = mongoose.model('NewUser')
const Other = mongoose.model('Other')
const jwt = require('jsonwebtoken')
const passport = require('passport')


exports.list_user_tickets = function(req, res, next) {
	const user = jwt.decode(req.headers.token.substring(4)).id
	Ticket.find({"user": user})
  .populate('user')
  .populate('info')
  .exec(function(err, doc) {
    if (err) {
      return next(err)
    }
    return res.status(200).send({success: true, data: doc})
  })
}

exports.list_tickets = function(req, res, next) {
	let tickets, requests
	Ticket.find({})
  .populate('user')
  .populate('info')
  .exec(function(err, doc) {
    if (err) {
      return next(err)
    }
    return res.status(200).send({success: true, data: doc})
  })
}

exports.new_request = function(req, res, next) {
	let sub_ticket
  switch (req.body.ticket.kind) {
    case "Access":
      sub_ticket = new Access(req.body.kind)
      break
    case "Equipment":
      sub_ticket = new Equipment(req.body.kind)
      break
    case "Error":
      sub_ticket = new Error(req.body.kind)
      break
    case "Print":
      sub_ticket = new Print(req.body.kind)
      break
    case "NewUser":
      sub_ticket = new NewUser(req.body.kind)
      break
    case "Other":
      sub_ticket = new Other(req.body.kind)
      break
    default:
      return res.status(500).send({success: false, msg: "Kind was not a valid type", kind: req.body.ticket.kind})
  }
  sub_ticket.save(function(err, doc) {
    if (err) {
      return next(err)
    }
    req.body.ticket.info = doc._id
    let new_ticket = new Ticket(req.body.ticket)
    new_ticket.save(function(err, ticket) {
      if (err) {
				return next(err)
      }
      return res.status(201).send({success: true, data: [ticket, doc], req: req.body});
    })
  })
}


exports.delete_tickets = function(req, res, next) {
  Ticket.remove({}, function(err, ticket) {
		if (err) {
			next(err)
		} else {
      res.json({ message: 'Tickets all successfully deleted' })
		}
  })
}


exports.edit_ticket = function(req, res, next) {
	Ticket.findOneAndUpdate({"_id": req.params.id}, { $set: req.body.ticket, $push: {log: req.body.log} }, { upsert: true, new: true })
  .populate('user')
  .exec(function(err, ticket) {
    if (err) {
      return next(err)
    }
			switch (ticket.kind) {
		    case "Access":
					Access.findOneAndUpdate({"_id": ticket.info._id}, { $set: req.body.info }, { upsert: true, new: true }, (err, doc)=>{
						if (err) {
							next(err)
						}
						return res.status(201).send({success: true, msg: "Info Successfully Updated.", data: [ticket, doc]})
					})
		      break
		    case "Equipment":
					Equipment.findOneAndUpdate({"_id": ticket.info._id}, { $set: req.body.info }, { upsert: true, new: true }, (err, doc)=>{
						if (err) {
							next(err)
						}
						return res.status(201).send({success: true, msg: "Info Successfully Updated.", data: [ticket, doc]})
					})
		      break
		    case "Error":
					Error.findOneAndUpdate({"_id": ticket.info._id}, { $set: req.body.info }, { upsert: true, new: true }, (err, doc)=>{
						if (err) {
							next(err)
						}
						return res.status(201).send({success: true, msg: "Info Successfully Updated.", data: [ticket, doc]})
					})
		      break
		    case "Print":
					Print.findOneAndUpdate({"_id": ticket.info._id}, { $set: req.body.info }, { upsert: true, new: true }, (err, doc)=>{
						if (err) {
							next(err)
						}
						return res.status(201).send({success: true, msg: "Info Successfully Updated.", data: [ticket, doc]})
					})
		      break
		    case "NewUser":
					NewUser.findOneAndUpdate({"_id": ticket.info._id}, { $set: req.body.info }, { upsert: true, new: true }, (err, doc)=>{
						if (err) {
							next(err)
						}
						return res.status(201).send({success: true, msg: "Info Successfully Updated.", data: [ticket, doc]})
					})
		      break
		    case "Other":
					Other.findOneAndUpdate({"_id": ticket.info._id}, { $set: req.body.info }, { upsert: true, new: true }, (err, doc)=>{
						if (err) {
							next(err)
						}
						return res.status(201).send({success: true, msg: "Info Successfully Updated.", data: [ticket, doc]})
					})
		      break
		    default:
		      return res.status(500).send({success: false, msg: "Kind was not a valid type", kind: ticket.kind})
			}
	})
}


exports.get_ticket = function(req, res, next) {
	let tickets, requests
	Ticket.find({"_id": req.params.id})
  .populate('user')
  .populate('info')
  .exec(function(err, doc) {
    if (err) {
      return next(err)
    }
    return res.status(200).send({success: true, data: doc})
  })
}
