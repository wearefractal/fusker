var fusker = require('../fusker');
var log = require('../logger');

exports.run = function (req, res) {
        fusker.http.blacklist.push({ip: req.connection.remoteAddress, date: new Date()});
        log.debug(req.connection.remoteAddress + ' has been banned from HTTP for ' + fusker.config.banLength + ' min');
};
