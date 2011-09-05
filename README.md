**Fusker is a library to prevent and manage a multitude of attacks in nodejs**

To install fusker, use [npm](http://github.com/isaacs/npm):

    $ npm install fusker

## Example

Please see [the examples folder](http://github.com/wearefractal/fusker/blob/master/examples/) to get an idea of how to use Fusker properly

## Test Site

You think you're one raw dog? [fusker.nodester.com](http://fusker.nodester.com/) Come at me bro.

## HTTP Configuration
### List of included HTTP detection modules (detectives)
```
csrf - Detects cross-site request forgery in incoming http requests
xss - Detects common XSS attacks in incoming http requests
sqli - Detects SQLi attempts in incoming http requests
lfi - Detects common LFI attacks in incoming http requests
404 - Punishes people who like to snoop around. Only use with single page applications
```
	
### List of included HTTP payload modules
```
blacklist - Blacklists IP from HTTP server for specified amount of time (banLength in config)
fake-report - Alerts attacker that they have been reported to ic3 and displays DOJ logo
saxroll - Redirects attacker to 1227.com
nimp - Redirects attacker to fusker.on.nimp.org (WARNING: Harmful to attacker)
nyan - Redirects attacker to nyan.cat
goatse - Redirects attacker to goatse.bz (WARNING: Harmful to eyes)
bush - Redirects attacker to full screen George W. Bush "you just fell for the trap"
lemonparty - Redirects attacker to lemonparty.org (WARNING: Harmful to eyes)
meatspin - Redirects attacker to meatspin.com (WARNING: Harmful to eyes)
explosive-impact - Redirects attacker to fullscreen video of ranting
raggedyann - Redirects attacker to extreme speaker rape. (WARNING: Harmful to speakers)
crews - Displays Terry Crews nipple dance rainbow b& page
```

### Adding HTTP detectives

Add a .js or .coffee file to the 'http-detectives' directory of the module.
	
### Adding HTTP payloads

Add a .js or .coffee file to the 'http-payloads' directory of the module.

## Socket.io Configuration
### List of included SocketIO detection modules (detectives)
```
xss - Detects common XSS attacks in incoming socket messages
sqli - Detects SQLi attempts in incoming socket messages
lfi - Detects common LFI attacks in incoming socket messages
```
	
### List of included SocketIO payload modules
```
blacklist - Blacklists IP from SocketIO server for specified amount of time (banLength in config)
```

### Adding SocketIO detectives

Add a .js or .coffee file to the 'socket-detectives' directory of the module.
	
### Adding SocketIO payloads

Add a .js or .coffee file to the 'socket-payloads' directory of the module.

## Other Configuration
### Express Middleware
Please see [this](http://github.com/wearefractal/fusker/blob/master/examples/express-test.coffee) for a working express example.
It's as easy as ```app.use(fusker.express.check);```
Detectives/payloads are the same as they would be for the fusker HTTP server. Make sure fusker is the first piece of middleware added.

### PROTIPS
Setting config.silent to true will turn off all logging
Setting config.verbose to true will turn on a ton of logging
	
## Contributors

- [Contra](https://github.com/Contra)

## LICENSE

(MIT License)

Copyright (c) 2011 Fractal <contact@wearefractal.com>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
