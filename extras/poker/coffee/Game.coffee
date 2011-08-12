###
  Poker Game
  @author jwill
###

class PokerGame
    constructor: () ->
        @deck = new Deck(3)
        @playerTokens = 500
        @maxTokens = 5
        @roundState = 0
        @currentRoundBet = 1
        @hand = new Hand()
        @evaluator = new Evaluator()
        @audio = new Audio("sounds/winn_up.wav")
        @init()
        self = this
        $(window).resize(() ->
            window.paper.clear() if window.paper isnt undefined
            self.init()
            # redraw hand
            hand.drawCards()
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
       # @drawPayouts()
        
        #buttons and label
        @betButton = new Button({x:35, y:30, fontSize:48, text:"Bet"})
        @betButton.setOnClick ()->
            window.game.incrementBet()
            
        @betButton.translate(@width-200, @height-150)
        
        attrList = {fill:"#FFF", stroke: 2};
        gameTitle = new Label({x:150, y:30, text: "Video Poker", fontSize:48 , attrList:attrList})
        
        
        @betLabel = new Label()
        @betLabel.setText("Bet: "+@currentRoundBet)
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
                game.playerTokens -= window.game.currentRoundBet 
                game.tokensLabel.setText "Tokens: "+game.playerTokens
            game.dealHand()
            game.hand.drawCards()
            game.hand.flipCards()
            winnings = game.evaluator.evaluate(game.hand)
            if game.roundState is 1 and winnings > 0
                game.playerTokens += (winnings * game.currentRoundBet)
                game.tokensLabel.setText "Tokens: "+game.playerTokens
                game.audio.play()
            game.roundState++
            
        @dealButton.translate(@width-200, @height-75)
    
    incrementBet: () ->
        if @roundState isnt 1
            @currentRoundBet++ 
            if @currentRoundBet > @maxTokens
                @currentRoundBet = 1
            @betLabel.setText("Bet: "+@currentRoundBet)
        
    decrementBet: () ->
        @currentRoundBet-- if @currentRoundBet > 1
        @betLabel.setText("Bet: "+@currentRoundBet)
        
    
    dealHand: () ->
        numCards = @hand.cardsNeeded()
        for i in [0...numCards]
            @hand.addToHand(@deck.dealCard())
    
    drawPayouts: () ->
        payoutLabels = "Royal Flush\nStraight Flush\nFour of A Kind\nFull House\n" + 
        "Flush\nStraight\nThree of A Kind\nTwo Pair\nJacks Or Better"
        attrList = {"text-anchor": "start", "font-size":24 }
        payoutCol1 = paper.text 0, 225, payoutLabels
        payoutCol1.attr(attrList)
        
        # col 2 - payout values
        values = _.values @evaluator.basePayouts
        values.reverse()
        attrList2 = {"text-anchor": "end", "font-size":24 }
        payoutCol2 = paper.text 300, 225, values.join "\n"
        payoutCol2.attr(attrList2)
        

    
    
window.PokerGame = PokerGame
