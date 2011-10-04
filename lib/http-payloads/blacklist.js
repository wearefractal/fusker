var config = require('../config');
var log = require('node-log');
var blacklist = require('../blacklist');

exports.run = function (req, res) {
  blacklist.add(req.connection.remoteAddress, config.banLength);
  log.debug(req.connection.remoteAddress + ' has been blacklisted for ' + config.banLength + ' min');
};

