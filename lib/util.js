exports.getMinutes = function (date){
	var minute = 1000*60;
	return date.getTime() / minute;
};

exports.getSince = function (date){
	var currTime = new Date();
	return exports.getMinutes(currTime) - exports.getMinutes(date);
};

exports.decode = function (input){
	return input;
};
