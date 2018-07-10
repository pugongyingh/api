const mongoose = require('mongoose')
const Inventory = mongoose.model('Inventory')
const Computer = mongoose.model('Computer')
const Cord = mongoose.model('Cord')
const Accessory = mongoose.model('Accessory')
const jwt = require('jsonwebtoken')
const passport = require('passport')

exports.list_inventory = function(req, res) {
	Inventory.find({})
    .populate('item')
    .populate('owner')
    .exec(function(err, doc) {
      if (err) {
        return res.status(500).send({success: false, msg: err});
      }
      return res.status(201).send({success: true, data: doc})
  })
}

exports.list_user_inventory = function(req, res) {
	Inventory.find({"owner": req.params.id})
		.populate('item')
		.populate('owner')
		.exec(function(err, doc) {
			if (err) {
				return res.status(500).send({success: false, msg: err});
			}
			return res.status(201).send({success: true, data: doc})
	})


/*
	, function(err, inventory) {
    if (err) {
			return res.status(403).send({success: false, msg: err})
		} else if (inventory === null) {
			return res.status(404).send({success: false, msg: "That user does not have any inventory."})
		} else {
			return res.status(200).send({success: true, data: inventory})
		}
	})*/
}

exports.new_inventory = function(req, res) {
  if (req.headers.edit === 'true') {
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
        return res.status(500).send({success: false, msg: "Kind was not a valid type", kind: req.body.inv.kind})
    }
    new_item.save(function(err, doc) {
      if (err) {
        return res.status(500).send({success: false, msg: err});
      }
      req.body.inv['item'] = doc._id
      let new_inv = new Inventory(req.body.inv)
      new_inv.save(function(err, inv) {
        if (err) {
          return res.status(500).send({success: false, msg: err});
        }
        return res.status(201).send({success: true, data: [inv, doc]});
      })
    })
  } else {
    let new_doc = new Inventory(req.body)
    new_doc.save(function(err, doc) {
      if (err) {
        return res.status(500).send({success: false, msg: err});
      }
      return res.status(201).send({success: true, data: doc});
    })
  }
}

exports.get_inventory = function(req, res) {
//  var token = getToken(req.headers)
//  if (token) {
  Inventory.findOne({ itreID: req.params.id })
    .populate('item')
    .populate('owner')
    .exec(function(err, doc) {
      if (err) {
        return res.status(500).send({success: false, msg: err});
      }
      return res.status(201).send({success: true, data: doc})
  })
//  } else {
//    return res.status(401).send({success: false, msg: 'You must be logged into the system to perform this action.'})
//  }
}

exports.delete_inventory = function(req, res) {
//  var token = getToken(req.headers)
//  if (token) {
    Inventory.remove({
      "_id": req.params.id
    }, function(err, computer) {
      if (err)
        res.send(err)
      res.json({ message: 'Item successfully deleted' })
    })
//  } else {
//    return res.status(401).send({success: false, msg: 'You must be logged into the system to perform this action.'})
//  }
}

exports.update_inventory = function(req, res) {
//  var token = getToken(req.headers)
//  if (token) {
    let updatedItem, updatedComputer, updatedCord, updatedMisc, updatedLog
    const keys = Reflect.ownKeys(req.body)
    const updatedValues = keys.reduce((accu, current) => {
      if(req.body[current]){
        accu[current] = req.body[current]
      }
      return accu
    },{})

    if (updatedValues.log) {
      const logKeys = Reflect.ownKeys(updatedValues.log)
      updatedLog = logKeys.reduce((accu, currentKey) => {
        if (updatedValues.log[currentKey]) {
          accu[currentKey] = updatedValues.log[currentKey]
        }
        return accu
      }, {})
    }

    Inventory.findOne({"_id": req.params.id}, function(err, data) {
      console.log(data)
      console.log(updatedLog)
      if (err) {
        return res.status(403).send({success: false, msg: err})
      } else {
        const keys = Reflect.ownKeys(updatedValues)
        keys.forEach((key) => {
          if (key == 'log') {
            data.log.push(req.body.log)
          } else {
            data[key] = updatedValues[key]
          }
        })

        data.date_updated = Date.now()

        data.save(function(err, updatedRecord){
          if(err){
            return res.status(403).send({success: false, msg: err})
          } else {
            return res.status(200).send({success: true, data: updatedRecord})
          }
        })
      }
    })
//  } else {
//    return res.status(401).send({success: false, msg: 'You must be logged into the system to perform this action.'})
//  }
}
