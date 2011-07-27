div ->
	coffeescript ->
		window.getPlayers = ->
			now.getPlayerList (data) ->
				console.log(data)
			
		now.ready ->
			console.log('ready')
div ->
	input type:'button', value:'Get Players', onclick:'getPlayers();'

