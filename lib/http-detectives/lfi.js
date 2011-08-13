var fusker = require('../fusker');

exports.check = function (req, res) {
	for (var i = fusker.patterns.lfi.length - 1; i >= 0; --i) {
		if (fusker.patterns.lfi[i].test(req.url)) {
			fusker.http.handleAttack('LFI-' + i, req, res);
			return;
		}
	}
};
