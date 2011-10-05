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
  
  self.addAll = function (array) {
    for (var i = 0; i < array.length; i++) {
        self.cards.push(array[i]);    
    }
  }
  
  self.playCard = function () {
    // Returns the card from the front of the deck;
    return self.cards.splice(0,1);
  }
  
  
            
  self.init();
}                                                

window.Hand = Hand;                                               
