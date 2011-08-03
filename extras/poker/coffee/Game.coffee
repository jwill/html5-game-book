##
 # Poker Game
 # @author jwill
 ##

class PokerGame
    constructor: () ->
        @basePayouts = [
            JacksOrBetter: 1,
            TwoPair: 2,
            ThreeKind: 3,
            Straight: 4,
            Flush: 6,
            FullHouse: 9,
            FourKind: 25
            StraightFlush: 50
            RoyalFlush: 250
        ]
        @deck = new Deck(1)
        @playerTokens = 500
        @maxTokens = 5
        @currentRoundToken = 1
        @width = 720
        @height = 805
        @init()
        
    init: () ->
        window.paper = Raphael($("#gameboard")[0], @width, @height)
        @gameBoard = paper.rect(0, 0, @width, @height, 15)
        @gameBoard.attr({
            fill:'#090',          
            stroke:'#000'  
        })
        @gameBoard.toBack()
    
    incrementBet: () ->
        @currentRoundToken++ if @currenRoundToken < @maxTokens
        
    decrementBet: () ->
        @currentRoundToken-- if @currentRoundToken > 1
        
    dealHand: (hand) ->
        
    evaluateHand: (hand) ->
        
    
    checkRoyalFlush: (hand) ->
        
    # royal, straight, and regular flush
    checkFlush: (hand) ->
        
    checkStraight: (hand) ->
    
    checkFourKind: (hand) ->
    
    checkFullHouse: (hand) ->
        
    checkThreeKind: (hand) ->
        
    checkTwoPair: (hand) ->
        
    checkPair: (hand) ->
   
window.PokerGame = PokerGame
    