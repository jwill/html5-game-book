@title = 'Game Lobby'
div class:'row', ->
	div id:'playingArea', class:'span14', ->
		canvas id:'board', ->
	div class:'span4',->
		div id:'chat', rows:'10', columns:'50', style:'width:200px;height:550px'
		br ->
		input type:'text', columns:'40', id:'message'
		input type:'button', value:'Send', onclick:"distributeMessage($('#message').get(0).value)"

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
		# todo add style to chat window
		val = $('#chat').html()
		val += name + ':' + message + '\n'
		$('#chat').html(val)
		console.log('Received message: ' + message + ' from: '+name)
	window.distributeMessage = (message) ->
		now.name = prompt("What is your name?") if now.name is 'Unknown'
		now.distributeMessage(message)
	window.now.receiveData = (type, data) ->
		console.log(type)
		console.log(data)
