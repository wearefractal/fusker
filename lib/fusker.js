/* Create global fusker var */
var fusker = {};

/* Bring in any internal library files */
fusker.util = require('./util');
fusker.config = require('./config');
fusker.http = require('./http');
fusker.socket = require('./socketio');
fusker.patterns = require('./patterns');

module.exports = fusker;
