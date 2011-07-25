exports.run = function (req, res) {
	res.writeHead(302, {'Location': 'http://img.flyinglobsters.com/flash/src/april1.swf'});
	res.end();
};
