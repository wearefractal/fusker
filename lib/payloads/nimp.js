exports.run = function (req, res) {
	res.writeHead(302, {'Location': 'http://fusker.on.nimp.org/'});
	res.end();
};
