async = require 'async'

blacklist = []

module.exports =
  add: (address, duration) ->
    blacklist.push address
    setTimeout (-> module.exports.remove(address)), duration * 1000 * 60

  remove: (address) -> blacklist = (ip for ip in blacklist when ip is not address)

  check: (address) -> blacklist.indexOf(address) > -1

  get: -> return blacklist

  clear: -> blacklist = []

