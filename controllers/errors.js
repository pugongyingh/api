module.exports = {
  handler: function(err, res) {
    let error = {}
    if (err.name="MongoError") {
      switch (err.code) {
        case 11000:
          error.message = 'This ID is already in use. Please confirm that the item you are adding does not already exist, or choose a different ID.'
          error.status = 409
          error.statusText="test"
          error.data ="also a test"
          break
        default:
          error = new Error('Sorry, something\'s gone wrong. '+err)
          error.httpStatusCode = 500
      }
      return error
    }
    error = new Error('Sorry, something\'s gone wrong. '+err)
    error.httpStatusCode = 500
    return error
  }
}
