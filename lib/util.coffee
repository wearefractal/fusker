config = require './config'
fs = require 'fs'

module.exports =
  logHTTP: (detective, req) ->
    olog = fs.createWriteStream config.httplog, flags: 'a'
    olog.write '[- ATTACK DETAILS FOR ' + Date.now + ' -]\r\n'
    olog.write ' --> Detective: ' + detective + '\r\n'
    olog.write ' --> Request: ' + req.method + ' ' + req.url + '\r\n'
    olog.write ' --> IP: ' + req.connection.remoteAddress + '\r\n'
    olog.write '[- END ATTACK DETAILS -]\r\n\r\n'
    olog.end()

  logSocket: (module, socket, msg) ->
    olog = fs.createWriteStream config.socketlog, flags: 'a'
    olog.write '[- ATTACK DETAILS FOR ' + new Date() + ' -]\r\n'
    olog.write ' --> Detective: ' + module + '\r\n'
    olog.write ' --> Socket Message: ' + msg + '\r\n'
    olog.write ' --> IP: ' + socket.remoteAddress + '\r\n'
    olog.write '[- END ATTACK DETAILS -]\r\n\r\n'
    olog.end()

