function Hand() {
  if ( !(this instanceof arguments.callee) ) {
  	 return new arguments.callee(arguments); 
  }
  
  var self = this;
  
  self.init = function () {
  	self.cards = [ ]
  }
  
  self.addToHand = function (card) {
  	self.cards.push(card);
  }
  
  self.playCard = function () {
  
  }
  
  self.drawHand = function () {
  	// Draws the back of the card to give player clickable area.
  }
            
  self.init();
}                                                

window.Hand = Hand;                                               
