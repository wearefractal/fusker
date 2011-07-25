var fusker = require('../fusker');

exports.check = function (req, res) {
	var headers = req.headers;
	
	if (/application\/j/.test(headers.accept)) {
		fusker.http.handleAttack('CSRF-0', req, res);

	//If we get a POST from another site, CSRF
	} else if (req.method == "POST" && headers.referer && !(headers.referer.indexOf(headers.host + '/') > 0)) {
		fusker.http.handleAttack('CSRF-1', req, res);

	//If we get a request without a method, CSRF (This seems a little sloppy, could be improved)
	} else if (req.method != "GET" && req.method != "POST") {
		fusker.http.handleAttack('CSRF-2', req, res);
	}
};
