var https = require('http');
var url = require('url');
var sys = require('sys');
var fs = require('fs');
var path = require('path');
var util = require('./util');
var config = require('./config');

var http = {};

http.detectives = new Array();
http.payloads = new Array();
http.blacklist = new Array();

/* Creates http server on specified port and listens on it. Runs every request through modules */
http.createServer = function (port) {
	console.log('[FUSKER] Creating HTTP server on port ' + port);
	console.log('[FUSKER] Detectives: ' + http.detectives);
	console.log('[FUSKER] Payloads: ' + http.payloads);

	var serv = https.createServer(function (req, res) {
		var userIP = req.connection.remoteAddress;
		//Fix file names
		var file = url.parse(req.url).pathname;
		if (file == '/') {
			file = '/index.html';
		}
		if (config.verbose) {
			console.log('[FUSKER] HTTP: ' + userIP + ' -> ' + file);
		}

		//Check our blacklist againts client
		for (var i = http.blacklist.length - 1; i >= 0; --i) {
			if (http.blacklist[i].ip == userIP) {
				var served = util.getSince(http.blacklist[i].date);
				if (served >= config.banLength) {
					console.log('[FUSKER] Lifting HTTP ban on ' + userIP);
					http.blacklist.splice(i, 1);
					break;
				} else {
					console.log('[FUSKER] ' + userIP + ' blocked via HTTP. Remaining: ' + Math.round(config.banLength - served) + ' min');
					res.end();
					return;
				}
			}
		}

		//Run request through specified modules
		for (var i = http.detectives.length - 1; i >= 0; --i) {
			var module = require('./http-detectives/' + http.detectives[i]);
			module.check(req, res);
		}

		//Feed up the file
		fs.readFile(config.dir + file, function (err, data) {
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
http.logAttack = function (file, module, req) {
	var log = fs.createWriteStream(file, {
		'flags': 'a'
	});

	log.write('[- ATTACK DETAILS FOR ' + new Date() + ' -]\r\n');
	log.write(' --> Detective: ' + module + '\r\n');
	log.write(' --> Request: ' + req.method + ' ' + req.url + '\r\n');
	log.write(' --> IP: ' + req.connection.remoteAddress + '\r\n');
	log.write('[- END ATTACK DETAILS -]\r\n\r\n');
	log.end();
};

/* Executes payload on attacker based on lulz level */
http.handleAttack = function (module, req, res) {
	console.log('[FUSKER] HTTP attack detected! Module: ' + module + ' IP: ' + req.connection.remoteAddress);
	http.logAttack(config.httplog, module, req);

	for (var i = http.payloads.length - 1; i >= 0; --i) {
		var module = require('./http-payloads/' + http.payloads[i]);
		module.run(req, res);
	}
};

module.exports = http;