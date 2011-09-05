url = require 'url'
sys = require 'sys'
fs = require 'fs'
path = require 'path'
util = require './util'
config = require './config'
log = require './logger'

socketio = {}
socketio.detectives = []
socketio.payloads = []
socketio.blacklist = []

socketio.detect = (args...) -> 
  if Object.isArray(args)
    socketio.detectives.merge args
  else
    socketio.detectives = x for x in args
    
socketio.punish = (args...) -> 
  if Object.isArray(args)
    socketio.payloads.merge args
  else
    socketio.payloads = x for x in args

socketio.listen = (server) ->
	log.info '[FUSKER] Creating Socket.IO server'
	log.info '[FUSKER] Detectives: ' + socketio.detectives
	log.info '[FUSKER] Payloads: ' + socketio.payloads
	sio = require 'socket.io'
	io = sio.listen server

	io.sockets.on 'connection', (socket) ->
		socket.remoteAddress ?= socket.handshake.address.address

		for entry in socketio.blacklist
			if entry.ip is socket.remoteAddress
				served = util.getSince entry.date
				if served >= config.banLength
					log.debug '[FUSKER] Lifting SocketIO ban on ' + socket.remoteAddress
					socketio.blacklist.remove entry
					break
				else
					log.debug '[FUSKER] ' + socket.remoteAddress + ' blocked via SocketIO. Remaining: ' + Math.round(config.banLength - served) + ' min'
					socket.disconnect()
					return

		socket.on 'newListener', (evt, listener) ->
			socket.listeners(evt).push (msg) ->

				log.debug '[FUSKER] SocketIO: ' + socket.remoteAddress + ' -> ' + evt

				for detective in socketio.detectives
					module = require './socket-detectives/' + detective
					module.check socket, sys.inspect(msg)
  io.enable "browser client minification"
  io.enable "browser client etag"
  io.set "log level", 1
  io.set "transports", [ "websocket", "flashsocket", "htmlfile", "xhr-polling", "jsonp-polling" ]
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
	log.info '[FUSKER] Socket attack detected! Module: ' + module + ' IP: ' + socket.remoteAddress
	socketio.logAttack config.socketlog, module, socket, msg

	for payload in socketio.payloads
		module = require './socket-payloads/' + payload
		module.run socket, msg

module.exports = socketio
