require 'colors'
config = require './config'
pack = require('./package').load()
  
module.exports =
  log: (str) ->
    if !config.silent
      console.log str

  debug: (str) ->
    if !config.silent and config.verbose
      console.log '[' + pack.name.magenta, '-', 'DEBUG'.upcase().green.inverse + ']', str	
      
  info: (str) ->
    if !config.silent
      console.log '[' + pack.name.magenta, '-', 'info'.white + ']', str
      
  warn: (str) ->
    if !config.silent
      console.log '[' + pack.name.magenta, '-', 'warn'.upcase().yellow + ']', str

  error: (str) ->
    if !config.silent
      console.log '[' + pack.name.magenta, '-', 'error'.upcase().red.inverse + ']', str
