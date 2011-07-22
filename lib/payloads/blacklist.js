var fusker = require('../fusker');

exports.run = function (req, res) {
	fusker.blacklist.push({ip: req.connection.remoteAddress, date: new Date()});
};
