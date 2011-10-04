class Evaluator
    constructor: () ->
   		@basePayouts = {
   			JacksOrBetter: 1
   			TwoPair: 2
   			ThreeKind: 3
   			Straight: 4
   			Flush: 6
   			FullHouse: 9
   			FourKind: 25
   			StraightFlush: 50
   			RoyalFlush: 250
   		}
   		@labels = {
   			JacksOrBetter: "Jacks Or Better"
   			TwoPair: "Two Pair"
   			ThreeKind: "Three of a Kind"
   			Straight: "Straight"
   			Flush: "Flush"
   			FullHouse: "Full House"
   			FourKind: "Four of a Kind"
   			StraightFlush: "Straight Flush"
   			RoyalFlush: "Royal Flush"
   		}
    evaluate: (hand) ->
    	currentValue = 0
    	a = @checkFlush(hand)
    	b = @checkFourKind(hand)
   		c = @checkFullHouse(hand)
    	d = @checkThreeKind(hand)
    	e = @checkStraight(hand)
    	f = @checkTwoPair(hand)
    	g = @checkJacksOrBetter(hand)
    	labels = _.compact([a,b,c,d,e,f,g])
    	values = (@basePayouts[val] for val in [a,b,c,d,e,f,g])
    	values = _.compact(values)
    	winnings = _.max(values)
    	for msg in labels
    		if (@basePayouts[msg] == winnings)
    			return [winnings, @labels[msg]]
    	return [0, "0"]
    	
    checkRoyalFlush: (hand) ->
    	vals = _.pluck(hand.cards, "val")
    	vals.sort()
    	return "RoyalFlush" if vals is [1, 10, 11, 12, 13]
    
    # royal, straight, and regular flush
    checkFlush: (hand) ->
        sorted = _.groupBy hand.cards, @suitHandler
        flush = @findLength(sorted, 5)
        if flush.length isnt 0
        	royal = @checkRoyalFlush(hand)
        	straightFlush = @checkStraightFlush(hand)
        	return royal if royal
        	return straightFlush if straightFlush
        	return "Flush"
    checkStraightFlush: (hand) ->
    	vals = _.pluck(hand.cards, "val")
    	vals.sort()
    	startValue = vals[0]
    	for i in [0...5]
    		return false if startValue+i isnt vals[i]
    	return "StraightFlush"
    checkStraight: (hand) ->
    	vals = _.pluck(hand.cards, "val")
    	vals.sort()
    	startValue = vals[0]
    	for i in [0...5]
    		return false if startValue+i isnt vals[i]
    	return "Straight" if vals is [1, 10, 11, 12, 13]
    	return "Straight"
    
    checkFourKind: (hand) ->
    	sorted = _.groupBy hand.cards, @ordinalHandler
    	quad = @findLength(sorted, 4)
    	return "FourKind" if quad.length isnt 0
    checkFullHouse: (hand) ->
    	sorted = _.groupBy hand.cards, @ordinalHandler
    	triple = @findLength(sorted, 3)
    	pair = @findLength(sorted, 2)
    	return "FullHouse" if ((triple.length isnt 0) and (pair.length isnt 0))
    checkThreeKind: (hand) ->
    	sorted = _.groupBy hand.cards, @ordinalHandler
    	triple = @findLength(sorted, 3)
    	return "ThreeKind" if triple.length isnt 0
    checkTwoPair: (hand) ->
    	pairs = @checkPair(hand)
    	return "TwoPair" if pairs.length == 2
    ordinalHandler: (card) ->
    	return card.val
    suitHandler: (card) ->
    	return card.suit
    checkJacksOrBetter: (hand) ->
    	pair = @checkPair(hand)
    	return "JacksOrBetter" if (Number(pair[0]) is 1) or (Number(pair[0]) > 10)
    	
    checkPair: (hand) ->
    	sorted = _.groupBy hand.cards, @ordinalHandler
    	pair = @findLength(sorted, 2)
    	return pair
    	
    numberOfKeys: (grouped) ->
    	i = 0
    	i++ for key of grouped
    	return i
    	
    findLength: (grouped, value) ->
    	x = []
    	for key of grouped
    		if grouped[key].length is value
    			x.push(key)
    	_.compact(x)
window.Evaluator = Evaluator