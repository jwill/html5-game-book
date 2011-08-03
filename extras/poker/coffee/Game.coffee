##
 # Poker Game
 # @author jwill
 ##

class PokerGame
    constructor: () ->
        @basePayouts = [
            JacksOrBetter: 1
            TwoPair: 2
            ThreeKind: 3
            Straight: 4
            Flush: 6
            FullHouse: 9
            FourKind: 25
            StraightFlush: 50
            RoyalFlush: 250
        ]
        @deck = new Deck(1)
        @playerTokens = 500
        @maxTokens = 5
        @currentRoundToken = 1
        @hand = new Hand()
        
        @init()
        self = this
        $(window).resize(() ->
            window.paper.clear() if window.paper isnt undefined
            self.init()
            # redraw hand
        )
        

        
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
        
        #buttons and label
        @betButton = new Button({x:35, y:30, fontSize:48, text:"Bet"})
        @betButton.setOnClick ()->
            alert("clicked")
            
        @betButton.translate(@width-200, @height-200)
        
        attrList = {fill:"#FFF", stroke: 2};
        gameTitle = paper.print(150,30, "Video Poker", paper.getFont("Droid Sans", "bold"), 48)
        gameTitle.attr(attrList)
        
        @betLabel = new Label()
        @betLabel.setText("Bet: "+@currentRoundToken)
        @betLabel.translate(@width-200, @height- 225)
    
    
    
    incrementBet: () ->
        @currentRoundToken++ 
        if @currentRoundToken > @maxTokens
            @currentRoundToken = 1
        @betLabel.setText("Bet: "+@currentRoundToken)
        
    decrementBet: () ->
        @currentRoundToken-- if @currentRoundToken > 1
        @betLabel.setText("Bet: "+@currentRoundToken)

    dealHand: (hand) ->
        
    evaluateHand: (hand) ->
    
    dealHand: () ->
        numCards = @hand.cardsNeeded()
        for i in [0...numCards]
            @hand.addToHand(@deck.dealCard())
    
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
