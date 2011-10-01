underscore = require 'underscore'
uuid = require 'node-uuid'
sys = require 'sys'
# game rooms
exports.GameRoom = (nowjs, everyone, cache)->
	everyone.now.createRoom = (roomName, callback) ->
			room = uuid()
			console.log("Created room: "+roomName)
			group = nowjs.getGroup(room)
			group.addUser(this.user.clientId)
			console.log group
			group.on 'connect', () ->
				group.now.room = room
				group.now.roomName = roomName
				user = this.user.clientId
				#try to get game state
				state = cache.get(room)
				if state isnt undefined
					console.log(state)
					state['players'].push(this.user.clientId)
					cache.put(room, state)
					group.now.receiveGameState(state)
				group.now.receiveMessage("System", user + " joined the game room "+ roomName+".")
			group.on 'disconnect', () ->
				user = this.user.clientId
				#try to get game state
				group.now.receiveMessage("System", user + " left the game room "+ roomName+".")
			rooms = cache.get('rooms')
			if (rooms is null or room is undefined)
				rooms = {}
			rooms[roomName] = room
			cache.put('rooms', rooms)
			
			console.log(rooms)
			callback({'room':room, 'roomName',roomName})
		
	everyone.now.joinRoom = (roomName, callback) ->
		rooms = cache.get("rooms")
		room = rooms[roomName]
		group = nowjs.getGroup(room)
		group.addUser(this.user.clientId)
		console.log(room)
		console.log(roomName)
		callback(roomName)
	
	everyone.now.leaveRoom = (roomName, callback) ->
		rooms = cache.get("rooms")
		room = rooms[roomName]
		group = nowjs.getGroup(room)
		callback(roomName)
		
	everyone.now.getRooms = (callback) ->
		rooms = cache.get("rooms")
		console.log("getRooms"+sys.inspect(rooms))
		callback(rooms)
