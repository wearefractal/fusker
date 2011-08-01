url = require 'url'
sys = require 'sys'
fs = require 'fs'
path = require 'path'
util = require './util'
config = require './config'

socketio = {}
socketio.detectives = new Array()
socketio.payloads = new Array()
socketio.blacklist = new Array()

socketio.listen = (server) ->
	console.log '[FUSKER] Creating Socket.IO server'
	sio = require 'socket.io'
	io = sio.listen server

	io.sockets.on 'connection', (socket) ->
		socket.remoteAddress = socket.handshake.address.address

		for entry in socketio.blacklist
			if entry.ip is socket.remoteAddress
				served = util.getSince entry.date
				if served >= config.banLength
					console.log '[FUSKER] Lifting SocketIO ban on ' + socket.remoteAddress
					socketio.blacklist.splice socketio.blacklist.indexOf(entry), 1
					break
				else
					console.log '[FUSKER] ' + socket.remoteAddress + ' blocked via SocketIO. Remaining: ' + Math.round(config.banLength - served) + ' min'
					socket.disconnect()
					return

		socket.on 'newListener', (evt, listener) ->
			socket.listeners(evt).push (msg) ->

				if config.verbose
					console.log '[FUSKER] SocketIO: ' + socket.remoteAddress + ' -> ' + evt

				for detective in socketio.detectives
					module = require './socket-detectives/' + detective
					module.check socket, sys.inspect(msg)
	return io

socketio.logAttack = (file, module, socket, msg) ->
	log = fs.createWriteStream file, flags: 'a'
	log.write '[- ATTACK DETAILS FOR ' + new Date() + ' -]\r\n'
	log.write ' --> Detective: ' + module + '\r\n'
	log.write ' --> Socket Message: ' + msg + '\r\n'
	log.write ' --> IP: ' + socket.remoteAddress + '\r\n'
	log.write '[- END ATTACK DETAILS -]\r\n\r\n'
	log.end()

socketio.handleAttack = (module, socket, msg) ->
	console.log '[FUSKER] Socket attack detected! Module: ' + module + ' IP: ' + socket.remoteAddress
	socketio.logAttack config.socketlog, module, socket, msg

	for payload in socketio.payloads
		module = require './socket-payloads/' + payload
		module.run socket, msg

module.exports = socketio
