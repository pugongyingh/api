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
exports.list_all_miscs = function(req, res) {
//  var token = getToken(req.headers);
//  if (token) {
//    } else {
      Inventory.find({"type": "misc"}, function(err, miscs) {
        if (err) {
          return res.status(500).send({success: false, msg: err});
				} else if (miscs === null) {
					return res.status(204).send({success: true, msg: "No misc items currently inventoried."});
				} else {
					return res.status(200).send({success: true, data: [miscs]});
				}
      });
//  }
};

exports.list_user_misc = function(req, res) {
	Inventory.find({"type": "misc", "owner": req.params.userId}, function(err, miscs) {
    if (err) {
			return res.status(403).send({success: false, msg: err})
		} else if (miscs === null) {
			return res.status(404).send({success: false, msg: "That user does not have any misc items."})
		} else {
			return res.status(200).send({success: true, data: [miscs]})
		}
	});
};

exports.create_a_misc = function(req, res) {
//  var token = getToken(req.headers);
//  if (token) {
	if (req.body.item === null || !req.body.item) {
		return res.status(400).send({success: false, msg: "No inventory data was submitted", data: req.body})
	} else if (req.body.type !== "misc") {
		return res.status(402).send({success: false, msg: "Data does not indicate a misc item and was not added to the database.", data: req.body})
	} else {
		req.body.date_added = Date.now();
    var new_misc = new Inventory(req.body);
    new_misc.save(function(err, misc) {
			if (err) {
				return res.status(500).send({success: false, msg: err});
			}
			return res.status(201).send({success: true, data: [misc]});
    });
	}

//  } else {
//    return res.status(401).send({success: false, msg: 'You must be logged into the system to perform this action.'});
//  }
};

exports.view_a_misc = function(req, res) {
//  var token = getToken(req.headers);
////  if (token) {
    Inventory.findOne({"_id": req.params.miscId, "type": "misc"}, function(err, misc) {
			if (err) {
				return res.status(403).send({success: false, msg: err});
			} else if (misc === null) {
				return res.status(404).send({success: false, msg: "That item does not exist."});
			} else {
				return res.status(200).send({success: true, data: [misc]});
			}
    });
//  } else {
//    return res.status(401).send({success: false, msg: 'You must be logged into the system to perform this action.'});
//  }
};

exports.update_a_misc = function(req, res) {
//  var token = getToken(req.headers);
//  if (token) {
    Inventory.findOneAndUpdate({"_id": req.params.miscId, "type": "misc"}, {
      $set: {
				item: req.body.item,
				date_updated: Date.now()
			},
      $push: {
				log: req.body.log
			}
    }, {new: true}, function(err, misc) {
			if (err) {
				return res.status(403).send({success: false, msg: err});
			} else if (misc === null) {
				return res.status(404).send({success: false, msg: "That item does not exist."});
			} else {
				return res.status(200).send({success: true, data: [misc]});
			}
    });
//  } else {
//    return res.status(401).send({success: false, msg: 'You must be logged into the system to perform this action.'});
//  }
};

exports.delete_a_misc = function(req, res) {
//  var token = getToken(req.headers);
//  if (token) {
    Inventory.remove({
      "_id": req.params.miscId
    }, function(err, misc) {
      if (err)
        res.send(err);
      res.json({ message: 'Item successfully deleted' });
    });
//  } else {
//    return res.status(401).send({success: false, msg: 'You must be logged into the system to perform this action.'});
//  }
};
