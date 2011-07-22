var fusker = require('../fusker');

exports.check = function (req, res) {
	var lfi = [/\.\.\//]; //Basic ../ match

	for (var i = lfi.length - 1; i >= 0; --i) {
		if (lfi[i].test(req.url)) {
			fusker.handleAttack('LFI-' + i, req, res);
			return;
		}
	}
};