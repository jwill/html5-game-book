@title = 'Game Lobby'
div id:'playingArea', style:'float:left;height:600px;width:800px;border:1', ->
	canvas id:'board', ->
div style:'float:right;',->
	textarea id:'chat', rows:'10', columns:'50', style:'width:200px;height:550px'
	br ->
	input type:'text', columns:'40', id:'message'
	input type:'button', value:'Send', onclick:"distributeMessage($('#message').get(0).value)"

  	
div id: 'fade',  class: 'black_overlay', -> 

# Page Logic
coffeescript ->
	now.ready ->
		now.name = 'Unknown'
	window.getPlayers = ->
		now.getPlayersList (data) ->
	#window.createRoom = (name) ->
	#	now.createRoom name, (data) ->
	#		console.log("Created room:"+data)
	window.now.receiveMessage = (name, message) ->
		val = $('#chat').get(0).value
		val += name + ':' + message + '\n'
		$('#chat').get(0).value = val
		console.log('Received message: ' + message + ' from: '+name)
	window.distributeMessage = (message) ->
		now.name = prompt("What is your name?") if now.name is 'Unknown'
		now.distributeMessage(message)
	window.now.receiveData = (type, data) ->
		console.log(type)
		console.log(data)
