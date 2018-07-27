const mongoose = require('mongoose')
const Computer = mongoose.model('Computer')
const jwt = require('jsonwebtoken')
const passport = require('passport')

//require('../config/passport')(passport)
/*
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
*/
exports.list_computers = function(req, res) {
//  var token = getToken(req.headers);
//  if (token) {
//    } else {
      Computer.find({}, function(err, computers) {
        if (err) {
          return res.status(500).send({success: false, msg: err});
				} else if (computers === null) {
					return res.status(204).send({success: true, msg: "No computers are currently inventoried."});
				} else {
					return res.status(200).send({success: true, data: [computers]});
				}
      });
//  }
};

exports.list_user_computers = function(req, res) {
	Computer.find({"type": "computer", "owner": req.params.userId}, function(err, computers) {
    if (err) {
			return res.status(403).send({success: false, msg: err})
		} else if (computers === null) {
			return res.status(404).send({success: false, msg: "That user does not have any computers."})
		} else {
			return res.status(200).send({success: true, data: [computers]})
		}
	});
};

exports.create_computer = function(req, res) {
//  var token = getToken(req.headers);
//  if (token) {
	if (req.body === null || !req.body) {
		return res.status(400).send({success: false, msg: "No inventory data was submitted", data: req.body})
	} else {
		req.body.date_added = Date.now();
    var new_computer = new Computer(req.body);
    new_computer.save(function(err, computer) {
			if (err) {
				return res.status(500).send({success: false, msg: err});
			}
			return res.status(201).send({success: true, data: [computer]});
    });
	}

//  } else {
//    return res.status(401).send({success: false, msg: 'You must be logged into the system to perform this action.'});
//  }
};

exports.view_computer = function(req, res) {
//  var token = getToken(req.headers);
////  if (token) {
    Computer.findOne({"_id": req.params.computerId, "type": "computer"}, function(err, computer) {
			if (err) {
				return res.status(403).send({success: false, msg: err});
			} else if (computer === null) {
				return res.status(404).send({success: false, msg: "That computer does not exist."});
			} else {
				return res.status(200).send({success: true, data: [computer]});
			}
    });
//  } else {
//    return res.status(401).send({success: false, msg: 'You must be logged into the system to perform this action.'});
//  }
};

exports.update_computer = function(req, res) {
//  var token = getToken(req.headers);
//  if (token) {
    Computer.findOneAndUpdate({"_id": req.params.computerId, "type": "computer"}, {
      $set: {
				item: req.body.item,
				date_updated: Date.now()
			},
      $push: {
				log: req.body.log
			}
    }, {new: true}, function(err, computer) {
			if (err) {
				return res.status(403).send({success: false, msg: err});
			} else if (computer === null) {
				return res.status(404).send({success: false, msg: "That computer does not exist."});
			} else {
				return res.status(200).send({success: true, data: [computer]});
			}
    });
//  } else {
//    return res.status(401).send({success: false, msg: 'You must be logged into the system to perform this action.'});
//  }
};

exports.delete_computer = function(req, res) {
//  var token = getToken(req.headers);
//  if (token) {
    Computer.remove({
      "_id": req.params.computerId
    }, function(err, computer) {
      if (err)
        res.send(err);
      res.json({ message: 'Computer successfully deleted' });
    });
//  } else {
//    return res.status(401).send({success: false, msg: 'You must be logged into the system to perform this action.'});
//  }
};
