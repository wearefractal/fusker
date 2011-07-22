var http = require('http');
var url = require('url');
var sys = require('sys');
var fs = require('fs');
var path = require('path');

/* Create global fusker var */
global.fusker = {};

/* Create our different levels of lulz */
fusker.levels = {};
fusker.levels.NONE = 'NONE';
fusker.levels.LOW = 'LOW';
fusker.levels.FAIR = 'FAIR';
fusker.levels.HIGH = 'HIGH';
fusker.levels.EXTREME = 'EXTREME';

/* Bring in any internal library files */
fusker.util = require('./util');
fusker.config = require('./config');
fusker.detect = new Array();

/* Creates http server on specified port and listens on it. Runs every request through modules */
fusker.createServer = function (port) {
	console.log('[FUSKER] Creating server on port ' + port);
	console.log('[FUSKER] Modules: ' + fusker.detect);
	var serv = http.createServer(function (req, res) {
		
		//Fix file names
		var file = url.parse(req.url).pathname;
		if (file == '/') {
			file = '/index.html';
		}
		console.log('[FUSKER] ' + req.connection.remoteAddress + ' -> ' + file);
		
		//Run request through specified modules
		for (var i = fusker.detect.length - 1; i >= 0; --i) {
			var module = require('./mods/' + fusker.detect[i]);
			module.check(req, res);
		}

		//Feed up the file
		fs.readFile(fusker.config.dir + file, function (err, data) {
			if (!err) {
				res.writeHead(200);
				res.write(data, 'utf8');
				res.end();
			}
		});
	});
	serv.listen(port);
	return serv;
};

/* Appends attack details to specified log file */
fusker.logAttack = function (file, module, req) {
	var log = fs.createWriteStream(file, {
		'flags': 'a'
	});

	log.write('[ - ATTACK DETAILS FOR ' + Date.now + ' - ]\r\n');
	log.write(' --> Module: ' + module + '\r\n');
	log.write(' --> Request: ' + req.method + ' ' + req.url + '\r\n');
	log.write(' --> IP: ' + req.connection.remoteAddress + '\r\n');
	log.write(' --> Raw Request: ' + sys.inspect(req.connection) + '\r\n');
	log.write('[ - END ATTACK DETAILS - ]\r\n\r\n');
	log.end();
};

/* Executes payload on attacker based on lulz level */
fusker.handleAttack = function (module, req, res) {
	var ip = req.connection.remoteAddress;
	console.log('[FUSKER] Attack detected! Module: ' + module + ' IP: ' + ip);
	fusker.logAttack('fusker-log.txt', module, req);
	switch (fusker.config.level.toUpperCase()) {
	case 'NONE':
		break;
	case 'LOW':
		break;
	case 'FAIR':
		break;
	case 'HIGH':
		break;
	case 'EXTREME':
		break;
	}
};
