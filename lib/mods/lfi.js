var url = require('url');

exports.check = function (req, res) {
	if (req.url.indexOf('../') > -1) {
		fusker.handleAttack('LFI', req, res);
	}
};