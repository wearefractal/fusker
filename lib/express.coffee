module.exports.check = (req, res, next) ->
  http = require './http'
  http.processRequest req, res
  if next?
    next()
