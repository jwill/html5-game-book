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
        
        @init()
        self = this
        $(window).resize(() ->
            window.paper.clear() if window.paper isnt undefined
            self.init()
            # redraw hand
        );

        
    init: () ->
        
        @width = window.innerWidth - 25
        @height = window.innerHeight - 25
        window.paper = Raphael($("#gameboard")[0], @width, @height) if window.paper is undefined
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
    
    dealHand: (hand) ->
    
    drawPayouts: () ->
    
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
