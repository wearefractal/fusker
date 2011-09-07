var fs = require('fs');
var url = require('url');
var path = require('path');
var fusker = require('../fusker');

exports.check = function (req, res) {
	var file = url.parse(req.url).pathname;
	switch (file) {
	case '/':
		file = '/index.html';
		break;
        case '/socket.io/socket.io.js':
        case '/socket.io/socket.io.min.js':
	case '/favicon.ico':
		//commonly 404d items that arent really snooping
		return;
	}
        
	fs.readFile(path.join(fusker.config.dir + file), function (err, data) {
		if (err) {
			fusker.http.handleAttack('404', req, res);
		}
	});
};
