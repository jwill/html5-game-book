# War card game logic
# uses SVG
exports.War = (nowjs, everyone) ->
	d = require('./Deck')
	everyone.now.startWarGame = (room, players) ->
		group = nowjs.getGroup(room)
	
		numDecks = Math.ceil(players.length * 18 / 52)
		deck = new d.Deck(numDecks)
		gameState = {}
		gameState['turn'] = 0
		gameState['playedHands'] = {}
		numPlayers = players.length
		hands = []
		for num in [0...numPlayers]
			hands.push(new Array())
			
		while (deck.cardsLeft() > 0)
				for i in [0...numPlayers]
					hands[i].push(deck.dealCard())
				
		for i in [0...numPlayers]
			cache.put(players[i],hands[i])
			console.log hands[i].length
		cache.put(room, gameState)
	
	everyone.now.getMyHand = (callback) ->
		hand = cache.get(this.now.name)
		callback(hand)
		
	everyone.now.getPlayedHand = (room, cards) ->
		group = nowjs.getGroup(room)
		gameState = cache.get(room)
		gameState.playedHands[this.user.clientId] = cards
		advanceToNextPlayer()
		
	everyone.now.removePlayer = ->	
		# if the player has cards, distribute them between the remaining players
		# if not, just remove him from the game
		
	everyone.now.evaluateHands = ->
		
		# reset the map of hands 
		group.now.playedHands = {}
