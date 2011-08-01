exports.getMinutes = (date) ->
  minute = 1000 * 60
  return date.getTime() / minute

exports.getSince = (date) ->
  currTime = new Date()
  return exports.getMinutes(currTime) - exports.getMinutes(date)
