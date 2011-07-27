sys = require('sys')
mongo = require 'mongoDB'
DB = mongo.Db
conx = mongo.Connection
Server = mongo.Server
gameroom = require '../controllers/GameRoom'

# games
tictactoe = require '../logic/tictactoe'
war = require '../logic/war'

exports.handleData = (client,data) ->
  obj = data
  switch obj?.operation
    when 'createRoom'
      gameType = obj.json.gameType
      name = obj.json.name
      gameroom.createGameRoom(client, gameType, name)
    when 'deleteRoom'
      roomId = obj.json.roomId
      gameroom.deleteGameRoom(client,roomId)
    when 'joinRoom'
      roomId = obj.json.roomId
      gameroom.joinRoom(client, roomId)
    when 'leaveRoom'
      roomId = obj.json.roomId
      gameroom.leaveRoom(client, roomId)
    when 'startGame'
      startGame(client, data)
    else 
      client.send {value:"Malformed packet.", operation:'response'}
      sys.puts "Malformed packet."
  sys.puts "handleData:"+sys.inspect(data)

      
exports.startGame = (client, data) ->
      roomId = obj.json.roomId
      room = cache[roomId]
      switch room.gameType
        when 'tictactoe'
          tictactoe.startGame(roomId)      
        else sys.puts "Can't figure out how to start game"