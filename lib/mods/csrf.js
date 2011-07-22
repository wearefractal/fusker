exports.check = function (req, res) {
	var headers = req.headers;
	/*
	if (!headers['x-requested-with']) {
		fusker.handleAttack('CSRF-1', req, res);

	} else */
	if (/application\/j/.test(headers.accept)) {
		fusker.handleAttack('CSRF-2', req, res);

	} else if (req.method == "POST" && headers.referer && headers.referer.indexOf(headers.host + '/') > 0) {
		fusker.handleAttack('CSRF-3', req, res);

	} else if (req.method != "GET" && req.method != "POST") {
		fusker.handleAttack('CSRF-4', req, res);
	}
};