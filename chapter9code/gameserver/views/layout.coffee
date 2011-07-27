doctype 5
html ->
	head ->
		title "#{@title}"
		link rel: 'stylesheet', href: 'css/main.css'
		script src: '/nowjs/now.js'
		script src: 'js/zepto.min.js'
		# games
		script src: 'TicTacToe/TicTacToe.js'
		
	coffeescript ->
			window.toggleElement = (element, visibility) ->
				$(element).get(0).style.display = visibility
				$('#fade').get(0).style.display = visibility
				""
			window.createGame = () ->
				cb = (data) -> 
					$('#roomName').get(0).innerHTML = "Room: "+roomName
					now.startTicTacToeGame(roomName)
					console.log(data)
				roomName = prompt("Give the game a name:")
				now.createRoom(roomName, cb)
				
	body ->
		div id: 'header', ->
			span id:'roomName', ->
			br ->
			button onclick:'createGame()', -> 'TicTacToe'
			span -> '  '
			button -> 'War'
			span -> '  '
			
		div id: 'content', ->
  			@body
  	

