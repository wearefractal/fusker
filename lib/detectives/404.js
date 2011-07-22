var fs = require('fs');
var url = require('url');
var fusker = require('../fusker');

exports.check = function (req, res) {
	var file = url.parse(req.url).pathname;
	switch (file) {
	case '/':
		file = '/index.html';
		break;

	case '/favicon.ico':
		//exit out if its the favicon, no need to 404 it
		return;
	}

	fs.readFile(fusker.config.dir + file, function (err, data) {
		if (err) {
			fusker.handleAttack('404', req, res);
		}
	});
};