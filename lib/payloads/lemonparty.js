exports.run = function (req, res) {
	res.writeHead(302, {'Location': 'http://lemonparty.org/'});
	res.end();
};
