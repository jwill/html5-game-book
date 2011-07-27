sys = require 'sys'

uuid = require('node-uuid')

class Player
	constructor: (@client) ->
		suffix = uuid().substring(0,5)
		@name = "Player-#{suffix}"
		sys.puts sys.inspect @client

exports.Player = Player

