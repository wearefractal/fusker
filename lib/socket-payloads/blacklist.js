var fusker = require('../fusker');
var log = require('../logger');

exports.run = function (socket, msg) {
	fusker.socket.blacklist.push({ip: socket.remoteAddress, date: new Date()});
	socket.disconnect();
	log.debug(socket.remoteAddress + ' has been banned from SocketIO for ' + fusker.config.banLength + ' min');
};
