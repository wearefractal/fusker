url = require 'url'
sys = require 'sys'
fs = require 'fs'
path = require 'path'
util = require './util'
config = require './config'
log = require 'node-log'
async = require 'async'
blacklist = require './blacklist'

socketio = {}
socketio.detectives = []
socketio.payloads = []

socketio.detect = (args...) -> socketio.detectives.push arg for arg in args
socketio.punish = (args...) -> socketio.payloads.push arg for arg in args

socketio.listen = (server) ->
  log.info 'Creating Socket.IO server!'
  log.info 'Detectives: ' + socketio.detectives if socketio.detectives?
  log.info 'Payloads: ' + socketio.payloads if socketio.payloads?
  sio = require 'socket.io'
  io = sio.listen server

  io.sockets.on 'connection', (socket) ->
    socket.remoteAddress ?= socket.handshake.address.address
    if blacklist.check socket.remoteAddress then return socket.disconnect()

    socket.on 'newListener', (evt, listener) ->
      socket.listeners(evt).push (msg) ->
        socketio.processRequest socket, msg, -> log.debug 'SocketIO: ' + socket.remoteAddress + ' -> ' + evt

  io.enable 'browser client minification'
  io.enable 'browser client etag'
  io.set 'log level', 1
  io.set 'transports', ['websocket', 'htmlfile', 'xhr-polling', 'jsonp-polling']
  return io

socketio.processRequest = (socket, message, cb) ->
  check = (detective, call) ->
    module = require './socket-detectives/' + detective
    module.check socket, sys.inspect(message)
    call()

  async.forEach socketio.detectives, check, cb

socketio.handleAttack = (module, socket, msg) ->
  log.warn 'Socket attack detected! Module: ' + module + ' IP: ' + socket.remoteAddress
  kill = (payload, call) ->
    module = require './socket-payloads/' + payload
    module.run socket, msg
    call()

  async.forEach socketio.payloads, kill, -> util.logSocket module, socket, msg

module.exports = socketio

