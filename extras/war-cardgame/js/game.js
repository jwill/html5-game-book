backImage = new Image("images/90dpi/back.png")
backImage.onload = function() {
        console.log("loaded");
        window.game = new WarGame();
}
backImage.src = "images/90dpi/back.png"

function PlayerDeck() { 
    var self = this;
    self.init = function () {
        self.back = new CachedImageView(backImage, 169, 245);
    };
    self.setX = function(xPos) {
        self.back.setX(xPos);    
    };
    self.setY = function(yPos) {
        self.back.setY(yPos);    
    };
    self.getPrimitive = function() {
        return self.back;    
    };
    
    self.init();
}



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
		//runner.addCallback(self.setTime);
		self.runner.start();
		self.createHands();
        
        // Add listener to 
         
	};
	
	self.createHands = function () {
		self.deck = new Deck(1);
		self.playerOne = new Hand();
		self.computer = new Hand();
        self.turn = "player";
		
		// deal cards
		while ( self.deck.cards.length != 0 ) {
			self.playerOne.addToHand(self.deck.dealCard());
			self.computer.addToHand(self.deck.dealCard());
		}
        
        self.playerOneDeck = new CachedImageView(backImage, 169, 245);;
        self.playerOneDeck.setX(50);
        self.playerOneDeck.setY(50);
        
        self.computerDeck = new CachedImageView(backImage, 169, 245);;
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
        
        self.runner.listen("MOUSE_PRESS", self.playerOneDeck, function(evt){console.log("clicked player deck");});
        
        self.group.add(self.playerCardText);
        self.group.add(self.computerCardText);
        self.group.add(self.playerOneDeck);
        self.group.add(self.computerDeck);
	}
	
	self.evaluateHands = function(handOne, handTwo) {
		
	}
	
	self.init();
}
