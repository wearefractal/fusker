//Including this creates global.fusker so no need to assign anything here
require('./lib/fusker');

//General configuration
fusker.config.dir = process.cwd(); //Sets the web directory to lock to. Default: process.cwd (Working directory)
fusker.config.level = fusker.levels.HIGH; //None, Low, Fair, High and Extreme - How badly to fuck with the hacker. Default: Fair
fusker.config.banlength = 20; //Length (in minutes) to blacklist attacker IP. Default: 1440 (24 hours)


//Configure detections, loaded from mods folder. 
//Tests will be executed in order, always put 404 last if you choose to use it
fusker.detect.push('xss'); //Checks URL for common XSS
fusker.detect.push('csrf'); //Checks headers for CSRF attacks
fusker.detect.push('lfi'); //Checks URL for common LFI
fusker.detect.push('404'); //Only use for single page applications and if you want to punish snoopers

var server = fusker.createServer(8080);
