var config = require('../config');
var log = require('node-log');
var blacklist = require('../blacklist');

exports.run = function (socket, msg) {
  blacklist.add(socket.remoteAddress, config.banLength);
  socket.disconnect();
  log.debug(socket.remoteAddress + ' has been blacklisted for ' + config.banLength + ' min');
};

