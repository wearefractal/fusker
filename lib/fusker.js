var http = require('http');
var url = require('url');
var sys = require('sys');
var fs = require('fs');
var path = require('path');

var fusker = {}

/* Bring in any internal library files */
fusker.util = require('./util');
fusker.config = require('./config');
fusker.detectives = new Array();
fusker.payloads = new Array();

/* Create blacklist */
fusker.blacklist = [];

/* Creates http server on specified port and listens on it. Runs every request through modules */
fusker.createServer = function (port) {
	console.log('[FUSKER] Creating server on port ' + port);
	console.log('[FUSKER] Detectives: ' + fusker.detectives);
	console.log('[FUSKER] Payloads: ' + fusker.payloads);

	var serv = http.createServer(function (req, res) {
		var userIP = req.connection.remoteAddress;
		//Fix file names
		var file = url.parse(req.url).pathname;
		if (file == '/') {
			file = '/index.html';
		}
		if(fusker.config.verbose){
			console.log('[FUSKER] ' + userIP + ' -> ' + file);
		}

		for (var i = fusker.blacklist.length - 1; i >= 0; --i) {
			if (fusker.blacklist[i].ip == userIP) {
				var served = fusker.util.getSince(fusker.blacklist[i].date);
				if (served >= fusker.config.banLength) {
					console.log('[FUSKER] Lifting ban on ' + userIP);
					fusker.blacklist.splice(i, 1);
					break;
				} else {
					console.log('[FUSKER] ' + userIP + ' blocked. Remaining: ' + Math.round(fusker.config.banLength - served) + ' min');
					res.end();
					return;
				}
			}
		}

		//Run request through specified modules
		for (var i = fusker.detectives.length - 1; i >= 0; --i) {
			var module = require('./detectives/' + fusker.detectives[i]);
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
	log.write(' --> Detective: ' + module + '\r\n');
	log.write(' --> Request: ' + req.method + ' ' + req.url + '\r\n');
	log.write(' --> IP: ' + req.connection.remoteAddress + '\r\n');
	log.write(' --> Raw Request: ' + sys.inspect(req.connection) + '\r\n');
	log.write('[ - END ATTACK DETAILS - ]\r\n\r\n');
	log.end();
};

/* Executes payload on attacker based on lulz level */
fusker.handleAttack = function (module, req, res) {
	console.log('[FUSKER] Attack detected! Module: ' + module + ' IP: ' + req.connection.remoteAddress);
	fusker.logAttack(fusker.config.logfile, module, req);

	for (var i = fusker.payloads.length - 1; i >= 0; --i) {
		var module = require('./payloads/' + fusker.payloads[i]);
		module.run(req, res);
	}
};

module.exports = fusker;
