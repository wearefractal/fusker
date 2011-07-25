var fusker = require('../fusker');

exports.check = function (socket, msg) {
	for (var i = fusker.patterns.sql.length - 1; i >= 0; --i) {
		if (fusker.patterns.sql[i].test(msg)) {
			fusker.socket.handleAttack('SQLi-' + i, socket, msg);
			return;
		}
	}
};