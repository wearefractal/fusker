require('coffee-script');
require 'protege'
require('node-log').setName 'fusker'

fusker = {}
fusker.util = require './util'
fusker.config = require './config'
fusker.http = require './http'
fusker.express = require './express'
fusker.socket = require './socketio'
fusker.patterns = require './patterns'

module.exports = fusker

