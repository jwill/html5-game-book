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
	};
	
	self.createHands = function () {
		self.deck = new Deck(1);
		self.playerOne = new Hand();
		self.computer = new Hand();
		
		// deal cards
		while ( self.deck.cards.length != 0 ) {
			self.playerOne.addToHand(self.deck.dealCard());
			self.computer.addToHand(self.deck.dealCard());
		}
	}
	
	self.evaluateHands = function(handOne, handTwo) {
		
	}
	
	self.init();
}
