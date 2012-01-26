require('node-log').setName 'fusker'

fusker = {}
fusker.attackLogger = require './attackLogger'
fusker.config = require './config'
fusker.http = require './http'
fusker.express = require './express'
fusker.socket = require './socketio'
fusker.patterns = require('xemplar').security

module.exports = fusker
