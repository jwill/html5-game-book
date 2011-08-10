class Evaluator
    constructor: () ->
    	
    evaluate: (hand) ->
    
    checkRoyalFlush: (hand) ->
    	vals = _.pluck(hand.cards, "val")
    	vals.sort()
    	return "RoyalFlush" if vals is [1, 10, 11, 12, 13]
    	return false
    
    # royal, straight, and regular flush
    checkFlush: (hand) ->
        sorted = _.groupBy hand.cards @suitHandler
        flush = @findLength(sorted, 5)
        if flush.length isnt 0
        	royal = checkRoyalFlush(hand)
        	straighFlush = checkStraightFlush(hand)
        	return royal if royal
        	return straightFlush if straightFlush
        	return "Flush"
        
    checkStraightFlush: (hand) ->
    	vals = _.pluck(hand.cards, "val")
    	vals.sort()
    	startValue = vals[0]
    	for i in [0..5]
    		return false if startValue+i isnt vals[i]
    	return "StraightFlush"
    checkStraight: (hand) ->
		vals = _.pluck(hand.cards, "val")
    	vals.sort()
    	startValue = vals[0]
    	for i in [0..5]
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
    	pairs = checkPair(hand)
    	return "TwoPair" if pairs.length == 2
        
    ordinalHandler: (card) ->
    	return card.ord
    suitHandler: (card) ->
    	return card.suit
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