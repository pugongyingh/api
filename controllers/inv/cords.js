var mongoose = require('mongoose'),
    Inventory = mongoose.model('Inventory'),
    jwt = require('jsonwebtoken'),
    passport = require('passport')

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
exports.list_all_cords = function(req, res) {
//  var token = getToken(req.headers);
//  if (token) {
//    } else {
      Inventory.find({"type": "cord"}, function(err, cords) {
        if (err) {
          return res.status(500).send({success: false, msg: err});
				} else if (cords === null) {
					return res.status(204).send({success: true, msg: "No cords are currently inventoried."});
				} else {
					return res.status(200).send({success: true, data: [cords]});
				}
      });
//  }
};

exports.list_user_computers = function(req, res) {
	Inventory.find({"type": "cord", "owner": req.params.userId}, function(err, cords) {
    if (err) {
			return res.status(403).send({success: false, msg: err})
		} else if (cords === null) {
			return res.status(404).send({success: false, msg: "That user does not have any cords."})
		} else {
			return res.status(200).send({success: true, data: [cords]})
		}
	});
};

exports.create_a_cord = function(req, res) {
//  var token = getToken(req.headers);
//  if (token) {
	if (req.body.item === null || !req.body.item) {
		return res.status(400).send({success: false, msg: "No inventory data was submitted", data: req.body})
	} else if (req.body.type !== "cord") {
		return res.status(402).send({success: false, msg: "Data does not indicate a cord and was not added to the database.", data: req.body})
	} else {
		req.body.date_added = Date.now();
    var new_cord = new Inventory(req.body);
    new_cord.save(function(err, cord) {
			if (err) {
				return res.status(500).send({success: false, msg: err});
			}
			return res.status(201).send({success: true, data: [cord]});
    });
	}

//  } else {
//    return res.status(401).send({success: false, msg: 'You must be logged into the system to perform this action.'});
//  }
};

exports.view_a_cord = function(req, res) {
//  var token = getToken(req.headers);
////  if (token) {
    Inventory.findOne({"_id": req.params.cordId, "type": "cord"}, function(err, cord) {
			if (err) {
				return res.status(403).send({success: false, msg: err});
			} else if (cord === null) {
				return res.status(404).send({success: false, msg: "That cord does not exist."});
			} else {
				return res.status(200).send({success: true, data: [cord]});
			}
    });
//  } else {
//    return res.status(401).send({success: false, msg: 'You must be logged into the system to perform this action.'});
//  }
};

exports.update_a_cord = function(req, res) {
//  var token = getToken(req.headers);
//  if (token) {
    Inventory.findOneAndUpdate({"_id": req.params.cordId, "type": "cord"}, {
      $set: {
				item: req.body.item,
				date_updated: Date.now()
			},
      $push: {
				log: req.body.log
			}
    }, {new: true}, function(err, cord) {
			if (err) {
				return res.status(403).send({success: false, msg: err});
			} else if (cord === null) {
				return res.status(404).send({success: false, msg: "That cord does not exist."});
			} else {
				return res.status(200).send({success: true, data: [cord]});
			}
    });
//  } else {
//    return res.status(401).send({success: false, msg: 'You must be logged into the system to perform this action.'});
//  }
};

exports.delete_a_cord = function(req, res) {
//  var token = getToken(req.headers);
//  if (token) {
    Inventory.remove({
      "_id": req.params.cordId
    }, function(err, cord) {
      if (err)
        res.send(err);
      res.json({ message: 'Computer successfully deleted' });
    });
//  } else {
//    return res.status(401).send({success: false, msg: 'You must be logged into the system to perform this action.'});
//  }
};
