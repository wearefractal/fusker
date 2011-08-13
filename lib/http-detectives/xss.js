var fusker = require('../fusker');

exports.check = function (req, res) {
	for (var i = fusker.patterns.xss.length - 1; i >= 0; --i) {
		if (fusker.patterns.xss[i].test(req.url)) {
			fusker.http.handleAttack('XSS-' + i, req, res);
			return;
		}
	}
};
