**node-fusker is a library to prevent and manage a multitude of attacks in nodejs**

To install node-fusker, use [npm](http://github.com/isaacs/npm):

    $ npm install fusker

## Example

Please see [test.js](http://github.com/Contra/fusker/blob/master/test.js) for a working example and documentation

## Levels of lulz (attacking the attackers)

	None - Blacklists IP
	Low - Blacklists IP, Redirects to Google
	Fair - Blacklists IP, Redirects to Saxroll
	High - Blacklists IP, Redirects to browser attack page (high chance of crashing the attacker)
	Extreme - Blacklists IP, Opens infinite tabs of attack pages (will absolutely crash the attacker)

## List of included detection modules

	404 - Detects 404 as a form of attack. Only use this if you have a single page application and want to punish people who like to snoop around
	xss - Detects common XSS attacks in incoming http requests
	sqli - Detects SQLi attempts in incoming http requests. Only an idiot would try to SQLi a node server (lol)
	lfi - Detects common LFI attacks in incoming http requests

## Extending the library

Add a .js or .coffee file to the 'mods' directory of the module.

Example:
	Adding msi.js to /mods/ will allow you to fusker.detect.push('msi');

## Contributors

- [tprime](https://github.com/tprime) - General

## LICENSE

(MIT License)

Copyright (c) 2011 Contra <contra@australia.edu>

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
