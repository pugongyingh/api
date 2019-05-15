const mongoose = require('mongoose')
const Program = mongoose.model('Program')


exports.list_program = function(req, res, next) {
	Program.find({})
		.exec(function(err, doc) {
			if (err) {
				return next(err)
			}
			return res.status(200).send({success: true, data: doc})
	})
}

exports.new_program = function(req, res, next) {
	if (req.body === null || !req.body) {
		return res.status(400).send({success: false, msg: "No program data was submitted", data: req.body})
	} else {
    let new_doc = new Program(req.body)
    new_doc.save(function(err, doc) {
      if (err) {
        return next(err)
      } else {
        return res.status(201).send({success: true, data: doc})
      }
    })
	}
}

exports.delete_program = function(req, res, next) {

}
