function ComputerEvent(action, playerCards) {
    var self = this;
    self.action = action;
    self.playerCards =playerCards;
}

backImage = new Image("images/90dpi/back.png")
backImage.onload = function() {
        console.log("loaded");
        window.game = new WarGame();
}
backImage.src = "images/90dpi/back.png"

function WarGame() {
	if ( !(this instanceof arguments.callee) ) {
        return new arguments.callee(arguments); 
  }
    
  var self = this;
    
	self.init = function () {
		self.group = new Group();
		
		var can = document.getElementById("gameboard");
		self.runner = new Runner().setCanvas(can);
		self.runner.root = self.group;
        self.cardGroup = new Group()
        self.group.add(self.cardGroup);
        
        self.isWar = false;
        
		self.runner.start();
		self.createHands();         
	};
	
	self.createHands = function () {
		self.deck = new Deck(1);
		self.playerOne = new Hand();
		self.computer = new Hand();
        self.playerTurn = true;
		
		// deal cards
		while ( self.deck.cards.length != 0 ) {
			self.playerOne.addToHand(self.deck.dealCard());
			self.computer.addToHand(self.deck.dealCard());
		}
        
        self.playerOneDeck = new CachedImageView(backImage, 169, 245);
        self.playerOneDeck.setX(50);
        self.playerOneDeck.setY(50);
        
        self.computerDeck = new CachedImageView(backImage, 169, 245);
        self.computerDeck.setX(981);
        self.computerDeck.setY(50);
        
        self.numPlayerCards = 26;
        self.numComputerCards = 26;
        
        self.playerCardText = new Text();
        self.playerCardText.setX(75);
        self.playerCardText.setY(320);
        self.playerCardText.setFill("black");
        self.playerCardText.setText(self.numPlayerCards + " cards")
        
        self.computerCardText = new Text();
        self.computerCardText.setX(1006);
        self.computerCardText.setY(320);
        self.computerCardText.setFill("black");
        self.computerCardText.setText(self.numComputerCards + " cards")
        
        self.runner.listen("MOUSE_PRESS", self.playerOneDeck, self.clickListener);
        self.runner.listen("COMPUTER_TURN", null, self.computerListener);
        self.runner.listen("EVALUATE", null, self.evaluate);
        
        self.group.add(self.playerCardText);
        self.group.add(self.computerCardText);
        self.group.add(self.playerOneDeck);
        self.group.add(self.computerDeck);
	}
    
    self.clickListener = function (evt) {
        // TODO Only if it is the players turn
        var card = self.playerOne.playCard();
        console.log(card);
        if (card[0]) {
            card[0].cardFront.x=239;
            card[0].cardFront.y=50;
            self.cardGroup.add(card[0].cardFront);
            self.numPlayerCards--;
            self.playerCardText.setText(self.numPlayerCards + " cards");
            self.runner.fireEvent("COMPUTER_TURN", null, new ComputerEvent(1, [card[0]]))
        }
        
    }
    
    self.computerListener = function (evt) {
        // TODO: Make event type for computer player
        console.log(evt)
        if (evt.action === 1) { // Draw a single card
           var card = self.computer.playCard();
        console.log(card);
        if (card[0]) {
            card[0].cardFront.x=797;
            card[0].cardFront.y=50;
            self.cardGroup.add(card[0].cardFront);
            self.numComputerCards--;
            self.computerCardText.setText(self.numComputerCards + " cards");
            self.runner.fireEvent("EVALUATE", null, new EvaluateEvent(evt.playerCards,[card[0]]))
        } 
        }
    }
    
    self.updateText = function () {
        self.playerCardText.setText(self.playerOne.cards.length + " cards");
        self.computerCardText.setText(self.computer.cards.length + " cards");
    }
	
	self.evaluate = function(evaluateEvent) {
		var handOneSize = evaluateEvent.handOne.length;
        var handTwoSize = evaluateEvent.handTwo.length;
        
        var handOneCard = evaluateEvent.handOne[handOneSize-1];
        var handTwoCard = evaluateEvent.handTwo[handTwoSize-1];
        var tempHand = null;
        
        console.log(evaluateEvent);
        
        if (handOneCard.val > handTwoCard.val) {
            console.log("Player 1 wins!")
            tempHand = evaluateEvent.handOne.concat(evaluateEvent.handTwo)
            self.playerOne.addAll(tempHand)
        } else if (handOneCard.val < handTwoCard.val) {
            console.log("Computer wins!")
            tempHand = evaluateEvent.handOne.concat(evaluateEvent.handTwo)
            self.computer.addAll(tempHand)
        } else {
            // War   
            console.log("war");
        }
        self.updateText();
	}
	
	self.init();
}

function EvaluateEvent(playerCards, computerCards) {
    var self = this;
    self.handOne = playerCards;
    self.handTwo = computerCards;
}