# Tic Tac Toe Logic

exports.TicTacToe = (nowjs, everyone, cache) ->
	console.log("here:"+everyone)
	everyone.now.startTicTacToeGame = (roomName) ->
		rooms = cache.get("rooms")
		room = rooms[roomName]
		group = nowjs.getGroup(room)
		roomState = {}
		
		# initialize gameboard
		gameboard = []
		for i in [0...3]
			array = []
			for j in [0...3]
				array.push("-")
			gameboard.push(array)
		roomState.board = gameboard
		roomState.players = []
		console.log(roomState)
		cache.put(room, roomState)
		group.now.drawTTTGameBoard();
	
	everyone.now.completeTicTacToeMove = (roomName, x, y, player) ->
		rooms = cache.get("rooms")
		room = rooms[roomName]
		group = nowjs.getGroup(room)
		roomState = cache.get(room)
		board = roomState.board
		console.log("here")
		otherPlayer = if player is 'X' then 'O' else 'X'
		if board[x][y] is '-'
			board[x][y] = player
			roomState.message = ""
			roomState.turn = otherPlayer
			cache.put(this.now.room, roomState)
		else 
			roomState.message = 'Player #{player}, Please try again.'
			cache.put(this.now.room, roomState)
		console.log(roomState)
		group.now.receiveGameState(roomState)
