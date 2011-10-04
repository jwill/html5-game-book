###
  Poker Game
  @author jwill
###

class PokerGame
    constructor: () ->
        @deck = new Deck(1)
        @playerTokens = 500
        @maxTokens = 5
        @roundState = 0
        @currentRoundBet = 1
        @hand = new Hand()
        @evaluator = new Evaluator()
        @payoutPane = new PayoutPane()
        @audio = new Audio("sounds/winn_up.wav")
        @soundOn = true
        @init()
        self = this
        $(window).resize(() ->
            window.paper.clear() if window.paper isnt undefined
            self.init()
            @payoutPane.draw()
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
        
        @soundButton = new Button({x:20, y:25, fontSize:24, text:"Sound On", dims:{x:150,y:40} })
        @soundButton.setOnClick ()->
            window.game.soundOn = !window.game.soundOn
            window.game.soundButton.setText("Sound Off") if window.game.soundOn is off
            window.game.soundButton.setText("Sound On") if window.game.soundOn is on
            
        @soundButton.translate(@width-190, 15)

        
        attrList = {fill:"#FFF", stroke: 2};
        gameTitle = new Label({x:150, y:30, text: "Video Poker", fontSize:48 , attrList:attrList})
        
        
        @betLabel = new Label()
        @betLabel.setText("Bet: "+@currentRoundBet)
        @betLabel.translate(@width-180, @height- 230)
    
        @tokensLabel = new Label()
        @tokensLabel.setText "Tokens: "+@playerTokens
        @tokensLabel.translate @width-225, @height - 190
        
        @message = new Label()
        @message.setText "Make your bet and click Deal."
        @message.translate 200,300
        
        @dealButton = new Button({x:25, y:30, fontSize:48, text:"Deal"})
        @dealButton.setOnClick ()->
            #round over
            if game.roundState is 2
                game.hand.clearCards()
                game.message.setText ""
                game.roundState = 0;
            #first draw
            if game.roundState is 0
                game.playerTokens -= window.game.currentRoundBet 
                game.tokensLabel.setText "Tokens: "+game.playerTokens
            game.dealHand()
            game.hand.drawCards()
            game.hand.flipCards()
            winnings = game.evaluator.evaluate(game.hand)
            if game.roundState is 1
                winnings = 0 if winnings is -Infinity
                game.playerTokens += (winnings[0] * game.currentRoundBet)
                game.tokensLabel.setText "Tokens: "+game.playerTokens
                game.message.setText winnings[1]  if winnings[0] > 0
                game.audio.play() if winnings[0] > 0 and game.soundOn is on
            game.roundState++
        
        @dealButton.translate(@width-200, @height-75)
        t = paper.text 0, 0, "Like this game? Want to make games like it?"
        t.attr({translation: "300,100", fill: 'yellow', "font-size":24})
        
        t = paper.text 0, 0, "Follow me on Twitter"
        t.attr({"href": "http://twitter.com/ecspike", translation: "300,200", fill: 'navy', "font-size":24})
        t = paper.text 0, 0, "Buy my book:\nLearning HTML5 Game Programming" 
        t.attr({"href": "http://amzn.to/HTML5-Game-Book", fill: 'navy', translation: "300,150", "font-size":24})
        t = paper.text 0, 0, "Circle me on Google+" 
        t.attr({"href": "http://profiles.google.com/James.L.Williams", fill: 'navy', translation: "300,225", "font-size":24})
    
    incrementBet: () ->
        if @roundState isnt 1
            @currentRoundBet++ 
            if @currentRoundBet > @maxTokens
                @currentRoundBet = 1
            @betLabel.setText("Bet: "+@currentRoundBet)
            @payoutPane.draw()
        
    decrementBet: () ->
        @currentRoundBet-- if @currentRoundBet > 1
        @betLabel.setText("Bet: "+@currentRoundBet)
        
    
    dealHand: () ->
        numCards = @hand.cardsNeeded()
        for i in [0...numCards]
            @hand.addToHand(@deck.dealCard())
    
    

    
    
window.PokerGame = PokerGame
