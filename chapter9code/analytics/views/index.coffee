@title = 'Game Lobby'
div ->
  "Flash: #{@flash}"
div ->
	canvas id:'mainView', height:640, width:800
	div ->
		"Chat and players"
