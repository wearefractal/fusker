fusker = require '../lib/fusker'
express = require 'express'

fusker.config.dir = process.cwd()
fusker.config.banLength = 1
fusker.config.verbose = true

fusker.http.detectives.push 'csrf', 'xss', 'sqli', 'lfi', '404'
fusker.http.payloads.push 'blacklist', 'bush'
fusker.socket.detectives.push 'xss', 'sqli', 'lfi'
fusker.socket.payloads.push 'blacklist'

app = express.createServer()
app.use fusker.express.check
app.use express.static(fusker.config.dir)
    
app.listen 8080
  
io = fusker.socket.listen app

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
