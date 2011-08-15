var fusker, io, server;
fusker = require('./lib/fusker');
fusker.config.dir = process.cwd();
fusker.config.banLength = 1;
fusker.config.verbose = true;
fusker.http.detectives.push('csrf', 'xss', 'sqli', 'lfi', '404');
fusker.http.payloads.push('blacklist', 'bush');
fusker.socket.detectives.push('xss', 'sqli', 'lfi');
fusker.socket.payloads.push('blacklist');
server = fusker.http.createServer(11380);
io = fusker.socket.listen(server);
io.sockets.on('connection', function(socket) {
  socket.emit('HelloClient', 'o hay thar client');
  socket.on('TestObject', function(msg) {
    return console.log('HelloServer1! Contents: ' + msg);
  });
  socket.on('TestObject', function(msg) {
    return console.log('HelloServer2! Contents: ' + msg);
  });
  socket.on('TestObject', function(msg) {
    return console.log('HelloServer3! Contents: ' + msg);
  });
  /* Uncomment the attack senders in index.html to test these */;
  socket.on('TestSQL', function(msg) {
    return console.log('SQL Handled! Contents: ' + msg);
  });
  socket.on('TestLFI', function(msg) {
    return console.log('LFI Handled! Contents: ' + msg);
  });
  return socket.on('TestXSS', function(msg) {
    return console.log('XSS Handled! Contents: ' + msg);
  });
});
