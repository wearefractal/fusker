exports.run = function (req, res) {
	res.writeHead(302, {'Location': 'http://www.youtube.com/v/uK0aQTzhBzE?autoplay=1'});
	res.end();
};
