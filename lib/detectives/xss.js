var fusker = require('../fusker');
exports.check = function (req, res) {
	var original = unescape(unescape(req.url));
	var xss = ['<', '>', '(', ')'];
	
	for (var i = xss.length - 1; i >= 0; --i) {
		if (original.indexOf(xss[i]) > -1) {
			fusker.handleAttack('XSS', req, res);
			return;
		}
	}
};
