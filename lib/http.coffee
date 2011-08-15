https = require 'http'
url = require 'url'
sys = require 'sys'
fs = require 'fs'
path = require 'path'
util = require './util'
config = require './config'
	  
http = {}
http.detectives = new Array()
http.payloads = new Array()
http.blacklist = new Array()

http.createServer = (port) ->
	console.log '[FUSKER] Creating HTTP server on port ' + port
	console.log '[FUSKER] Detectives: ' + http.detectives
	console.log '[FUSKER] Payloads: ' + http.payloads

	serv = https.createServer (req, res) ->
    unless req
      return
    http.processRequest req, res
      
    file = url.parse(req.url).pathname
    if file is '/'
	    file = '/index.html'
	
    fs.readFile config.dir + file, (err, data) ->
	    unless err
		    res.writeHead 200
		    res.write data, 'utf8'
		    res.end()

	serv.listen port
	return serv

/* This is split out so it can be used in other places (such as the express middleware) */
http.processRequest = (req, res) ->
		userIP = req.connection.remoteAddress
		if config.verbose
			console.log '[FUSKER] HTTP: ' + userIP + ' -> ' + req.url
    
		for entry in http.blacklist
			if entry.ip is userIP
				served = util.getSince entry.date
				if served >= config.banLength
					console.log '[FUSKER] Lifting HTTP ban on ' + userIP
					http.blacklist.splice http.blacklist.indexOf(entry), 1
					break
				else
					console.log '[FUSKER] ' + userIP + ' blocked via HTTP. Remaining: ' + Math.round(config.banLength - served) + ' min'
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
	console.log '[FUSKER] HTTP attack detected! Module: ' + module + ' IP: ' + req.connection.remoteAddress
	http.logAttack config.httplog, module, req

	for payload in http.payloads
		module = require './http-payloads/' + payload
		module.run req, res
    
module.exports = http
