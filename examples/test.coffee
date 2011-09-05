fusker = require '../lib/fusker'

fusker.config.dir = __dirname
fusker.config.banLength = 1
fusker.config.verbose = true

fusker.http.detect 'csrf', 'xss', 'sqli', 'lfi', '404'
fusker.http.punish 'blacklist', 'bush'
fusker.socket.detect 'xss', 'sqli', 'lfi'
fusker.socket.punish 'blacklist'

server = fusker.http.createServer 8080, 'admin', 'pass123'
io = fusker.socket.listen server

io.sockets.on 'connection', (socket) ->

  socket.emit 'HelloClient', 'o hay thar client'
  socket.on 'TestObject', (msg) ->
    console.log 'HelloServer1! Contents: ' + msg
  
  socket.on 'TestObject', (msg) ->
    console.log 'HelloServer2! Contents: ' + msg
  
  socket.on 'TestObject', (msg) ->
    console.log 'HelloServer3! Contents: ' + msg
  
  /* Uncomment the attack senders in index.html to test these */
  socket.on 'TestSQL', (msg) ->
    console.log 'SQL Handled! Contents: ' + msg
  
  socket.on 'TestLFI', (msg) ->
    console.log 'LFI Handled! Contents: ' + msg
  
  socket.on 'TestXSS', (msg) ->
    console.log 'XSS Handled! Contents: ' + msg
