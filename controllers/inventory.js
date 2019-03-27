const mongoose = require('mongoose')
const Inventory = mongoose.model('Inventory')
const Computer = mongoose.model('Computer')
const Cord = mongoose.model('Cord')
const Accessory = mongoose.model('Accessory')
const jwt = require('jsonwebtoken')
const passport = require('passport')
const async = require("async")


exports.list_inventory = function(req, res, next) {
	Inventory.find({})
    .populate('item')
    .populate('program')
    .populate('user')
    .exec(function(err, doc) {
      if (err) {
	      return next(err)
      }
      return res.status(200).send({success: true, data: doc})
  })
}

exports.list_user_inventory = function(req, res, next) {
	const user = jwt.decode(req.headers.token.substring(4)).id
	Inventory.find({"user": user})
		.populate('item')
		.populate('program')
    .populate('user')
		.exec(function(err, doc) {
			if (err) {
	      return next(err)
			} else {
				return res.status(200).send({success: true, data: doc})
			}
	})
}

exports.new_inventory = function(req, res, next) {
  let new_item
  switch (req.body.inv.kind) {
    case "Computer":
      new_item = new Computer(req.body.item)
      break
    case "Cord":
      new_item = new Cord(req.body.item)
      break
    case "Accessory":
      new_item = new Accessory(req.body.item)
      break
    default:
      return next(err)
  }
  new_item.save(function(err, doc) {
    if (err) {
      return next(err)
    }
    req.body.inv.item = doc._id
    let new_inv = new Inventory(req.body.inv)
    new_inv.save(function(err, inv) {
      if (err) {
				return next(err)
      }
      return res.status(201).send({success: true, data: [inv, doc]});
    })
  })
}

exports.get_inventory = function(req, res, next) {
//  var token = getToken(req.headers)
//  if (token) {
  Inventory.findOne({ "_id": req.params.id })
    .populate('item')
    .populate('program')
    .populate('user')
    .exec(function(err, doc) {
      if (err) {
        //return res.status(500).send({success: false, msg: err});
				return next(err)
      } else {
				return res.status(200).send({success: true, data: doc})
			}
  })
//  } else {
//    return res.status(401).send({success: false, msg: 'You must be logged into the system to perform this action.'})
//  }
}

exports.delete_inventory = function(req, res, next) {
//  var token = getToken(req.headers)
//  if (token) {
	if (req.params.id === 'all') {
		Inventory.deleteMany({}, function(err, user) {
			if (err) {
				return next(err)
			}
			res.json({ message: 'All Inventory Successfully Deleted' })
		})
	} else {
		Inventory.deleteOne({
	    "_id": req.params.id
	  }, function(err, computer) {
			if (err) {
	      return next(err)
			} else {
	      res.json({ message: 'Item successfully deleted' })
			}
	  })
	}

//  } else {
//    return res.status(401).send({success: false, msg: 'You must be logged into the system to perform this action.'})
//  }
}

exports.update_inventory = function(req, res, next) {
	Inventory.findOneAndUpdate(
		{"_id": req.params.id},
		{ $set: req.body.inv, $push: {log: req.body.log} },
		{ upsert: true, new: true }
	)
	.populate('program')
	.populate('user')
	.exec(function(err, inv) {
		if (err) {
			//return res.status(500).send({success: false, msg: err});
			return next(err)
		}
			switch (inv.kind) {
	      case "Computer":
	        Computer.findOneAndUpdate({"_id": inv.item._id}, { $set: req.body.item }, { upsert: true, new: true }, (err, doc)=>{
						if (err) {
				      return next(err)
						}
						return res.status(201).send({success: true, msg: "Computer Successfully Updated.", data: [inv, doc]})
					})
	        break
	      case "Cord":
	        Cord.findOneAndUpdate({"_id": inv.item._id}, { $set: req.body.item }, { upsert: true, new: true }, (err, doc)=>{
						if (err) {
				      return next(err)
						}
						return res.status(201).send({success: true, msg: "Cord Successfully Updated.", data: [inv, doc]})
					})
	        break
	      case "Accessory":
	        Accessory.findOneAndUpdate({"_id": inv.item._id}, { $set: req.body.item }, { upsert: true, new: true }, (err, doc)=>{
						if (err) {
				      return next(err)
						}
						return res.status(201).send({success: true, msg: "Accessory Successfully Updated.", data: [inv, doc]})
					})
	        break
	      default:
		      return next(err)
	    }
	})
}

exports.new_batch = function(req, res, next) {
	let list = []
	async.map(req.body.batch, (line, callback) => {
		let new_item
		switch (line.kind) {
			case "Computer":
				new_item = new Computer(line.item)
				break
			case "Cord":
				new_item = new Cord(line.item)
				break
			case "Accessory":
				new_item = new Accessory(line.item)
				break
			default:
				console.log('Wrong Kind')
				callback()
		}

		new_item.save(function(err, doc) {
			line.item = doc._id
			line.user_id = req.body.user.username
			line.program_id = req.body.user.program_id
			line.available = false
			let new_inv = new Inventory(line)
			new_inv.save(function(err, inv) {
				if (err) {
					console.log(err)
				} else {
					new_inv._id = inv._id
					new_inv.item = doc
					list.push(new_inv)
					callback()
				}
			})
		})
	}, (err, results) => {
		if (err) {
			console.log(err)
			return next(err)
		}
		return res.status(201).send({success: true, msg: "Items Successfully Added.", data: list})
	})

}

	exports.edit_batch = function(req, res, next) {
		for (let line of req.body.batch) {
			line.available = false
			Inventory.findOneAndUpdate({"itreID": line.itreID}, { $set: line, $push: {log: req.body.log} }, { upsert: true, new: true })
			.populate('program')
			.populate('user')
			.exec(function(err, inv) {
				if (err) {
					return next(err)
				}
				if (line.item) {
					switch (inv.kind) {
			      case "Computer":
			        Computer.findOneAndUpdate({"_id": line.item._id}, { $set: line.item }, { upsert: true, new: true }, (err, doc)=>{
								if (err) {
						      return next(err)
								}
							})
			        break
			      case "Cord":
			        Cord.findOneAndUpdate({"_id": line.item._id}, { $set: line.item }, { upsert: true, new: true }, (err, doc)=>{
								if (err) {
						      return next(err)
								}
							})
			        break
			      case "Accessory":
			        Accessory.findOneAndUpdate({"_id": line.item._id}, { $set: line.item }, { upsert: true, new: true }, (err, doc)=>{
								if (err) {
						      return next(err)
								}
							})
			        break
			      default:
				      return next(err)
			    }
				}
			})
	}
	return res.status(201).send({success: true, msg: "Items Successfully Updated."})

}
