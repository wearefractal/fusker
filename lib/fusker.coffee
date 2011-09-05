require 'protege'

/* Create global var */
fusker = {}

/* Merge all of the libraries */
fusker.util = require './util'
fusker.config = require './config'
fusker.http = require './http'
fusker.express = require './express'
fusker.socket = require './socketio'
fusker.patterns = require './patterns'

module.exports = fusker
