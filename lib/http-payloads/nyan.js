exports.run = function (req, res) {
	res.writeHead(302, {'Location': 'http://nyan.cat/'});
	res.end();
};
