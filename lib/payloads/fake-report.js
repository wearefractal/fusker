exports.run = function (req, res) {
	var html = '<html>';
	html += '<head><title>Crime Report</title></head>';
	html += '<body><center>';
	html += '<img src="http://mokellyreport.files.wordpress.com/2009/07/doj.gif"/><br/>';
	html += 'Your IP (' + req.connection.remoteAddress + ') and appropriate attack details have been automatically submitted to http://ic3.gov/';
	html += '</center></body>';
	res.writeHead(200);
	res.write(html, 'utf8');
	res.end();
};