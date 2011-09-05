var fusker = require('../fusker');

exports.check = function (req, res) {
	for (var i = fusker.patterns.sql.length - 1; i >= 0; --i) {
		if (fusker.patterns.sql[i].test(req.url)) {
			fusker.http.handleAttack('SQLi-' + i, req, res);
			return;
		}
	}
};
