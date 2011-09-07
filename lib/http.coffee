https = require 'http'
url = require 'url'
sys = require 'sys'
fs = require 'fs'
path = require 'path'
util = require './util'
config = require './config'
log = require './logger'
mime = require 'mime'
digest = require 'digest'
          
http = {}
http.detectives = []
http.payloads = []
http.blacklist = []

http.detect = (args...) -> http.detectives.merge args
http.punish = (args...) -> http.payloads.merge args
  
http.createServer = (port, username, password) ->
  log.info ('Creating HTTP server on port ' + port).green
  log.info 'Detectives: ' + http.detectives
  log.info 'Payloads: ' + http.payloads
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
      
  http.processRequest req, res
    
  uri = url.parse(req.url).pathname
  filename = path.join(config.dir, uri)   
           
  path.exists filename, (exists) -> 
    unless exists
      res.writeHead 404, 'Content-Type': 'text/plain'
      res.end()
      return    
    if fs.statSync(filename).isDirectory()    
      filename += '/index.html'
       
    fs.readFile filename, 'binary', (err, file) ->
      if err
        res.writeHead 500, 'Content-Type': 'text/plain'
        res.write err + '\n'
        res.end()
        return
          
      res.writeHead 200, 'Content-Type': mime.lookup(filename)
      res.write file, 'binary'
      res.end()
          
/* This is split out so it can be used in other places (such as the express middleware) */
http.processRequest = (req, res) ->
  userIP = req.connection.remoteAddress
  log.debug 'HTTP: ' + userIP + ' -> ' + req.url

  for entry in http.blacklist
    if entry.ip is userIP
      served = util.getSince entry.date
      if served >= config.banLength
        log.debug 'Lifting HTTP ban on ' + userIP
        http.blacklist.remove entry
        break
      else
        log.debug userIP + ' blocked via HTTP. Remaining: ' + Math.round(config.banLength - served) + ' min'
        res.end()
        return

  for detective in http.detectives
    module = require './http-detectives/' + detective
    module.check req, res

http.logAttack = (file, module, req) ->
  olog = fs.createWriteStream file, flags: 'a'
  olog.write '[- ATTACK DETAILS FOR ' + new Date() + ' -]\r\n'
  olog.write ' --> Detective: ' + module + '\r\n'
  olog.write ' --> Request: ' + req.method + ' ' + req.url + '\r\n'
  olog.write ' --> IP: ' + req.connection.remoteAddress + '\r\n'
  olog.write '[- END ATTACK DETAILS -]\r\n\r\n'
  olog.end()

http.handleAttack = (module, req, res) ->
  log.warn 'HTTP attack detected! Module: ' + module + ' IP: ' + req.connection.remoteAddress
  http.logAttack config.httplog, module, req

  for payload in http.payloads
    module = require './http-payloads/' + payload
    module.run req, res
    
module.exports = http
