//Including this creates global.fusker so no need to assign anything here
var fusker = require('../lib/fusker');

//General configuration
fusker.config.dir = process.cwd(); //Sets the web directory to lock to. Default: process.cwd (Working directory)
fusker.config.banLength = 1; //Length (in minutes) to blacklist attacker IP. Default: 1440 (24 hours)
fusker.config.verbose = true; //Verbose logging. Default: false

//Detectives and payloads will be executed in order
fusker.http.detectives.push('csrf', 'xss', 'sqli', 'lfi', '404');
fusker.http.payloads.push('blacklist', 'bush');

fusker.socket.detectives.push('xss', 'sqli', 'lfi');
fusker.socket.payloads.push('blacklist');

var server = fusker.http.createServer(8080);

var io = fusker.socket.listen(server);

io.sockets.on('connection', function (socket){

	socket.emit('HelloClient', 'o hay thar client')
	socket.on('TestObject', function (msg) {
		//console.log('HelloServer! Contents: ' + msg);
	});
	socket.on('TestSQL', function (msg){
		//console.log('Handled! Contents: ' + msg);
	});
	socket.on('TestLFI', function (msg){
		//console.log('Handled! Contents: ' + msg);
	});
	socket.on('TestXSS', function (msg){
		//console.log('Handled! Contents: ' + msg);
	});
});
