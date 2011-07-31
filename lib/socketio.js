var url = require('url');
var sys = require('sys');
var fs = require('fs');
var path = require('path');
var util = require('./util');
var config = require('./config');

var socketio = {};

socketio.detectives = new Array();
socketio.payloads = new Array();
socketio.blacklist = new Array();

socketio.listen = function (server) {
	console.log('[FUSKER] Creating Socket.IO server');
	var sio = require('socket.io');
	var io = sio.listen(server);
	
	io.sockets.on('connection', function (socket) {
		socket.remoteAddress = socket.handshake.address.address; //I'm lazy and don't feel like grabbing the handshake IP each time.

		//Check our blacklist againts client
		for (var i = socketio.blacklist.length - 1; i >= 0; --i) {
			if (socketio.blacklist[i].ip == socket.remoteAddress) {
				var served = util.getSince(socketio.blacklist[i].date);
				if (served >= config.banLength) {
					console.log('[FUSKER] Lifting SocketIO ban on ' + socket.remoteAddress);
					socketio.blacklist.splice(i, 1);
					break;
				} else {
					console.log('[FUSKER] ' + socket.remoteAddress + ' blocked via SocketIO. Remaining: ' + Math.round(config.banLength - served) + ' min');
					socket.disconnect();
					return;
				}
			}
		}

		//Any time a listener is added to a socket, remove it, wrap it with fusker, and re-add
		socket.on('newListener', function (evt, listener) {
				//console.log("Wrapping fusker for " + evt);
				socket.listeners(evt).push(function (msg) {
					if (config.verbose) {
						console.log('[FUSKER] SocketIO: ' + socket.remoteAddress + ' -> ' + evt);
					}
					for (var i = socketio.detectives.length - 1; i >= 0; --i) {
						var module = require('./socket-detectives/' + socketio.detectives[i]);
						module.check(socket, sys.inspect(msg));
					}
					//listener('fusked! ' + msg); //Calls our original listener
				});	
		});
	});
	
	return io;
};

/* Appends attack details to specified log file */
socketio.logAttack = function (file, module, socket, msg) {
	var log = fs.createWriteStream(file, {
		'flags': 'a'
	});

	log.write('[- ATTACK DETAILS FOR ' + new Date() + ' -]\r\n');
	log.write(' --> Detective: ' + module + '\r\n');
	log.write(' --> Socket Message: ' + msg + '\r\n');
	log.write(' --> IP: ' + socket.remoteAddress + '\r\n');
	log.write('[- END ATTACK DETAILS -]\r\n\r\n');
	log.end();
};

/* Executes payload on attacker based on lulz level */
socketio.handleAttack = function (module, socket, msg) {
	console.log('[FUSKER] Socket attack detected! Module: ' + module + ' IP: ' + socket.remoteAddress);
	socketio.logAttack(config.socketlog, module, socket, msg);

	for (var i = socketio.payloads.length - 1; i >= 0; --i) {
		var module = require('./socket-payloads/' + socketio.payloads[i]);
		module.run(socket, msg);
	}
};

module.exports = socketio;
