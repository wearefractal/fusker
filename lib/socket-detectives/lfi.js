var fusker = require('../fusker');

exports.check = function (socket, msg) {
	for (var i = fusker.patterns.lfi.length - 1; i >= 0; --i) {
		if (fusker.patterns.lfi[i].test(msg)) {
			fusker.socket.handleAttack('LFI-' + i, socket, msg);
			return;
		}
	}
};