https = require 'http'
url = require 'url'
sys = require 'sys'
fs = require 'fs'
path = require 'path'
util = require './util'
config = require './config'
log = require './logger'
mime = require 'mime'
	  
http = {}
http.detectives = []
http.payloads = []
http.blacklist = []

http.detect = (args...) -> 
  if Object.isArray(args)
    http.detectives.merge args
  else
    http.detectives = x for x in args
    
http.punish = (args...) -> 
  if Object.isArray(args)
    http.payloads.merge args
  else
    http.payloads = x for x in args
  
http.createServer = (port) ->
	log.info '[FUSKER] Creating HTTP server on port ' + port
	log.info '[FUSKER] Detectives: ' + http.detectives
	log.info '[FUSKER] Payloads: ' + http.payloads

	serv = https.createServer (req, res) ->
    unless req
      return
    http.processRequest req, res
      
    uri = url.parse(req.url).pathname
    filename = path.join(config.dir, uri)
    
    path.exists filename, (exists) ->
      unless exists
        res.writeHead 404, "Content-Type": "text/plain"
        res.write "404 Not Found\n"
        res.end()
        return
          
      if fs.statSync(filename).isDirectory()    
        filename += "/index.html"
        
      fs.readFile filename, "binary", (err, file) ->
        if err
          res.writeHead 500, "Content-Type": "text/plain"
          res.write err + "\n"
          res.end()
          return
            
        res.writeHead 200, "Content-Type": mime.lookup(filename)
        res.write file, "binary"
        res.end()

	serv.listen port
	return serv

/* This is split out so it can be used in other places (such as the express middleware) */
http.processRequest = (req, res) ->
		userIP = req.connection.remoteAddress
		log.debug '[FUSKER] HTTP: ' + userIP + ' -> ' + req.url
    
		for entry in http.blacklist
			if entry.ip is userIP
				served = util.getSince entry.date
				if served >= config.banLength
					log.debug '[FUSKER] Lifting HTTP ban on ' + userIP
					http.blacklist.remove entry
					break
				else
					log.debug '[FUSKER] ' + userIP + ' blocked via HTTP. Remaining: ' + Math.round(config.banLength - served) + ' min'
					res.end()
					return

		for detective in http.detectives
      module = require './http-detectives/' + detective
      module.check req, res

http.logAttack = (file, module, req) ->
	log = fs.createWriteStream file, flags: 'a'
	log.write '[- ATTACK DETAILS FOR ' + new Date() + ' -]\r\n'
	log.write ' --> Detective: ' + module + '\r\n'
	log.write ' --> Request: ' + req.method + ' ' + req.url + '\r\n'
	log.write ' --> IP: ' + req.connection.remoteAddress + '\r\n'
	log.write '[- END ATTACK DETAILS -]\r\n\r\n'
	log.end()

http.handleAttack = (module, req, res) ->
	log.info '[FUSKER] HTTP attack detected! Module: ' + module + ' IP: ' + req.connection.remoteAddress
	http.logAttack config.httplog, module, req

	for payload in http.payloads
		module = require './http-payloads/' + payload
		module.run req, res
    
module.exports = http
