const mongoose = require('mongoose')
const Ticket = mongoose.model('Ticket')
const Access = mongoose.model('Access')
const Equipment = mongoose.model('Equipment')
const Error = mongoose.model('Error')
const Print = mongoose.model('Print')
const NewUser = mongoose.model('NewUser')
const Other = mongoose.model('Other')
const Borrow = mongoose.model('Borrow')
const jwt = require('jsonwebtoken')
const passport = require('passport')


exports.list_user_tickets = function(req, res, next) {
	const user = jwt.decode(req.headers.token.substring(4)).id
	Ticket.find({"user": user})
  .populate('user')
  .populate('info')
  .exec(function(err, doc) {
    if (err) {
			err.name = 'FindError'
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
			err.name = 'FindError'
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
    case "Borrow":
      sub_ticket = new Borrow(req.body.kind)
      break
    default:
      return next({name:'Kind'})
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
	if (req.params.id === 'all') {
    Ticket.remove({}, function(err, user) {
      if (err) {
  			return next(err)
  		}
      res.json({ message: 'All Tickets Successfully Deleted' })
    })
  } else {
	  Ticket.remove({"_id": req.params.id}, function(err, ticket) {
			if (err) {
				next(err)
			} else {
	      res.json({ message: 'Ticket Successfully Deleted' })
			}
	  })
	}
}


exports.edit_ticket = function(req, res, next) {
	if (!req.body.log) {
		req.body.log = {
			type: 'Update',
		  note: 'Log not included in update'
		}
	}
	Ticket.findOneAndUpdate({"_id": req.params.id}, { $set: req.body.ticket, $push: {log: req.body.log} }, { upsert: true, new: true })
  .populate('user')
  .exec(function(err, ticket) {
    if (err) {
			err.name = 'UpdateError'
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
		    case "Borrow":
					Borrow.findOneAndUpdate({"_id": ticket.info._id}, { $set: req.body.info }, { upsert: true, new: true }, (err, doc)=>{
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
		      return next({name:'Kind'})
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
			err.name = 'FindError'
      return next(err)
    }
    return res.status(200).send({success: true, data: doc})
  })
}

exports.batch_purchase = function(req, res, next) {
	let ids = []
	for (let line of req.body.batch) {
		let sub_ticket = new Equipment(line.kind)
		sub_ticket.save(function(err, doc) {
			if (err) {
				err.name='SubNew'
				return next(err)
			}
			line.ticket.info = doc._id
			let new_ticket = new Ticket(line.ticket)
			new_ticket.save(function(err, ticket) {
				if (err) {
					err.name="New"
					return next(err)
				}
				ids.push(ticket)
			})
		})
	}
	return res.status(201).send({success: true, msg: "Tickets Successfully Added.", data: ids})
}
