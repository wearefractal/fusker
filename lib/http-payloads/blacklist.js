var fusker = require('../fusker');

exports.run = function (req, res) {
	fusker.http.blacklist.push({ip: req.connection.remoteAddress, date: new Date()});
		console.log('[FUSKER] ' + req.connection.remoteAddress + ' has been banned from HTTP for ' + fusker.config.banLength + ' min');
};
