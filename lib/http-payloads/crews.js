var html = '<html>';
html += '<head>';
html += '<title>LOL BANNED</title>';
html += '</head>';
html += '<body bgcolor="black" background="http://content.ytmnd.com/content/1/d/b/1db6ede2772ba8f5428dbff9f1f2e3be.gif">';
html += '<br/><br/>';
html += '<center>';
html += '<h1>YA GOOFED - B&</h1><br/>';
html += '<img src="http://content.ytmnd.com/content/1/7/c/17c9f89183c18613f48450a649e3f64c.gif">';
html += '<embed src="http://www.youtube.com/v/ykJxwaGVzYY?autoplay=1&rel=0" type="application/x-shockwave-flash" wmode="transparent" width="1" height="1"></embed>';
html += '</center>';
html += '</body>';
html += '</html>';

exports.run = function (req, res) {
	res.writeHead(200);
	res.write(html, 'utf8');
	res.end();
};
