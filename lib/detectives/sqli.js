var fusker = require('../fusker');

exports.check = function (req, res) {
	var sql = [/((\%3D)|(=))[^\n]*((\%27)|(\')|(\-\-)|(\%3B)|(;))/i, //SQL meta-characters
	/\w*((\%27)|(\'))((\%6F)|o|(\%4F))((\%72)|r|(\%52))/i, //Simple SQLi
	/((\%27)|(\'))union/i, //SQLi with UNION
	/exec(\s|\+)+(s|x)p\w+/ix, //SQLi for MSSQL
	/UNION(?:\s+ALL)?\s+SELECT/i]; //SQLi UNION SELECT
	
	for (var i = sql.length - 1; i >= 0; --i) {
		if (sql[i].test(req.url)) {
			fusker.handleAttack('SQLi-' + i, req, res);
			return;
		}
	}
};