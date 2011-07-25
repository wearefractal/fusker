var fusker = require('../fusker');

exports.run = function (socket, msg) {
	fusker.socket.blacklist.push({ip: socket.remoteAddress, date: new Date()});
	socket.disconnect();
	console.log('[FUSKER] ' + socket.remoteAddress + ' has been banned from SocketIO for ' + fusker.config.banLength + ' min');
};
