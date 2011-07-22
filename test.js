//Including this creates global.fusker so no need to assign anything here
require('./lib/fusker');

//General configuration
fusker.config.dir = process.cwd(); //Sets the web directory to lock to. Default: process.cwd (Working directory)
fusker.config.banLength = 1; //Length (in minutes) to blacklist attacker IP. Default: 1440 (24 hours)
fusker.config.verbose = true; //Verbose logging. Default: false

//Configure detections, loaded from detectives folder. 
//Tests will be executed in order, always put 404 last if you choose to use it
fusker.detectives.push('xss'); //Checks URL for common XSS
fusker.detectives.push('sqli'); //Checks URL for common SQL queries
fusker.detectives.push('csrf'); //Checks headers for CSRF attacks
fusker.detectives.push('lfi'); //Checks URL for common LFI
fusker.detectives.push('404'); //Only use for single page applications and if you want to punish snoopers

//Configure payloads, loaded from payloads folder. 
//Payloads will be executed in order. Run redirects last
fusker.payloads.push('blacklist'); //Blacklists IP
fusker.payloads.push('bush'); //Redirects to GW Bush trap page

var server = fusker.createServer(8080);
