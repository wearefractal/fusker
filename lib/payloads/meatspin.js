exports.run = function (req, res) {
	res.writeHead(302, {'Location': 'http://meatspin.com/'});
	res.end();
};
