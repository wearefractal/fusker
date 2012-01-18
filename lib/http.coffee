https = require 'http'
url = require 'url'
sys = require 'sys'
fs = require 'fs'
path = require 'path'
util = require './util'
config = require './config'
log = require 'node-log'
mime = require 'mime'
digest = require 'digest'
async = require 'async'
blacklist = require './blacklist'

http = {}
http.detectives = []
http.payloads = []

http.detect = (args...) -> http.detectives.push arg for arg in args
http.punish = (args...) -> http.payloads.push arg for arg in args

http.createServer = (port, username, password) ->
  log.info 'Creating HTTP server on port ' + port
  log.info 'Detectives: ' + http.detectives if http.detectives?
  log.info 'Payloads: ' + http.payloads if http.payloads?
  if username? and password?
    log.info 'Login Credentials: ' + (username + ':' + password).red
    serv = digest.createServer username, password, http.serveRequest
  else
    serv = https.createServer http.serveRequest
  serv.listen port
  return serv

http.serveRequest = (req, res) ->
  unless req
    return

  http.processRequest req, res, ->
    uri = url.parse(req.url).pathname
    filename = path.join(config.dir, uri)

    path.exists filename, (exists) ->
      unless exists
        res.writeHead 404
        return res.end()

      if fs.statSync(filename).isDirectory()
        filename += '/' + config.index
        path.exists filename, (exists) ->
          unless exists
            res.writeHead 404
            return res.end()

      fs.readFile path.normalize(filename), 'binary', (err, file) ->
        if err
          res.writeHead 500
          return res.end()

        res.writeHead 200, 'Content-Type': mime.lookup(filename)
        res.write file, 'binary'
        res.end()

http.processRequest = (req, res, cb) ->
  userIP = req.connection.remoteAddress
  log.debug 'HTTP: ' + userIP + ' -> ' + req.url

  if blacklist.check userIP
    res.writeHead 403
    return res.end()

  check = (detective, call) ->
    module = require './http-detectives/' + detective
    module.check req, res
    call()

  async.forEach http.detectives, check, cb

http.handleAttack = (module, req, res) ->
  log.warn 'HTTP attack detected! Module: ' + module + ' IP: ' + req.connection.remoteAddress
  kill = (payload, call) ->
    module = require './http-payloads/' + payload
    module.run req, res
    call()

  async.forEach http.payloads, kill, -> util.logHTTP module, req

module.exports = http

