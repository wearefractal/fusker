exports.check = function (req, res) {
	var xss = [/((\%3C)|<)((\%2F)|\/)*[a-z0-9\%]+((\%3E)|>)/ix, //Simple XSS
	/((\%3C)|<)((\%69)|i|(\%49))((\%6D)|m|(\%4D))((\%67)|g|(\%47))[^\n]+((\%3E)|>)/I, //IMG SRC XSS
	/((\%3C)|<)[^\n]+((\%3E)|>)/I]; //All XSS
	for (var i = xss.length - 1; i >= 0; --i) {
		if (xss[i].test(req.url)) {
			fusker.handleAttack('XSS-' + i, req, res);
			return;
		}
	}
};