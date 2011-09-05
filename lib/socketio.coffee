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

socketio.detect = (args...) -> socketio.detectives.merge args
socketio.punish = (args...) -> socketio.payloads.merge args

socketio.listen = (server) ->
  log.info 'Creating Socket.IO server!'.green
  log.info 'Detectives: ' + socketio.detectives
  log.info 'Payloads: ' + socketio.payloads
  sio = require 'socket.io'
  io = sio.listen server

  io.sockets.on 'connection', (socket) ->
    socket.remoteAddress ?= socket.handshake.address.address

    for entry in socketio.blacklist
      if entry.ip is socket.remoteAddress
        served = util.getSince entry.date
        if served >= config.banLength
          log.debug 'Lifting SocketIO ban on ' + socket.remoteAddress
          socketio.blacklist.remove entry
          break
        else
          log.debug socket.remoteAddress + ' blocked via SocketIO. Remaining: ' + Math.round(config.banLength - served) + ' min'
          socket.disconnect()
          return

    socket.on 'newListener', (evt, listener) ->
      socket.listeners(evt).push (msg) ->
        log.debug 'SocketIO: ' + socket.remoteAddress + ' -> ' + evt
        for detective in socketio.detectives
          module = require './socket-detectives/' + detective
          module.check socket, sys.inspect(msg)
            
  io.enable 'browser client minification'
  io.enable 'browser client etag'
  io.set 'log level', 1
  io.set 'transports', [ 'websocket', 'flashsocket', 'htmlfile', 'xhr-polling', 'jsonp-polling' ]
  return io

socketio.logAttack = (file, module, socket, msg) ->
  olog = fs.createWriteStream file, flags: 'a'
  olog.write '[- ATTACK DETAILS FOR ' + new Date() + ' -]\r\n'
  olog.write ' --> Detective: ' + module + '\r\n'
  olog.write ' --> Socket Message: ' + msg + '\r\n'
  olog.write ' --> IP: ' + socket.remoteAddress + '\r\n'
  olog.write '[- END ATTACK DETAILS -]\r\n\r\n'
  olog.end()

socketio.handleAttack = (module, socket, msg) ->
  log.warn 'Socket attack detected! Module: ' + module + ' IP: ' + socket.remoteAddress
  socketio.logAttack config.socketlog, module, socket, msg

  for payload in socketio.payloads
    module = require './socket-payloads/' + payload
    module.run socket, msg

module.exports = socketio
