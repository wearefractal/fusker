exports.run = function (req, res) {
	res.writeHead(302, {'Location': 'http://raggedyann.ytmnd.com/'});
	res.end();
};