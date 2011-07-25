var fusker = require('../fusker');

exports.check = function (socket, msg) {
	for (var i = fusker.patterns.xss.length - 1; i >= 0; --i) {
		if (fusker.patterns.xss[i].test(msg)) {
			fusker.socket.handleAttack('XSS-' + i, socket, msg);
			return;
		}
	}
};