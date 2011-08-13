express = {}

express.check = (req, res, next) ->
  http = require('./fusker').http
  http.processRequest req, res
  if next
    next()
module.exports = express
