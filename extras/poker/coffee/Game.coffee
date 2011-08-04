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
        @roundState = 0
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
            window.game.incrementBet()
            
        @betButton.translate(@width-200, @height-150)
        
        attrList = {fill:"#FFF", stroke: 2};
        gameTitle = paper.print(150,30, "Video Poker", paper.getFont("Droid Sans", "bold"), 48)
        gameTitle.attr(attrList)
        
        @betLabel = new Label()
        @betLabel.setText("Bet: "+@currentRoundToken)
        @betLabel.translate(@width-180, @height- 230)
    
        @tokensLabel = new Label()
        @tokensLabel.setText "Tokens: "+@playerTokens
        @tokensLabel.translate @width-225, @height - 190
        
        @dealButton = new Button({x:25, y:30, fontSize:48, text:"Deal"})
        @dealButton.setOnClick ()->
            #round over
            if game.roundState is 2
                game.hand.clearCards()
                game.roundState = 0;
            #first draw
            if game.roundState is 0
                game.playerTokens -= window.game.currentRoundToken 
                game.tokensLabel.setText "Tokens: "+game.playerTokens
            game.dealHand()
            game.hand.drawCards()
            game.hand.flipCards()
            game.evaluateHand()
            game.roundState++
            
        @dealButton.translate(@width-200, @height-75)
    
    incrementBet: () ->
        @currentRoundToken++ 
        if @currentRoundToken > @maxTokens
            @currentRoundToken = 1
        @betLabel.setText("Bet: "+@currentRoundToken)
        
    decrementBet: () ->
        @currentRoundToken-- if @currentRoundToken > 1
        @betLabel.setText("Bet: "+@currentRoundToken)
        
    evaluateHand: () ->
        alert("evaluate")
       
    
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
