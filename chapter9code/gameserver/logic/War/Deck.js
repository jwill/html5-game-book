/*
    Defines the Deck object.
    @author jwill
*/
c = require('./Card')
function Deck(numDecks) {
    var cards;
    var self = this;
    
    self.init = function() {        
        self.cards = new Array(52 * numDecks);
        self.initCards();
    }
    
    self.initCards = function() {
        // Initialize the cards 
        // 11 = Jack, 12 = Queen, 13 = K, 14 = A
        var ordinals = ['2','3','4','5','6', '7', '8', '9', '10', '11', '12', '13','14'];
        var suits = ['club', 'spade', 'heart','diamond'];
        
        // Populate card array
        for (var k = 0; k<numDecks; k++) {
            for (var j = 0; j < suits.length; j++) {
                for (var i = 0; i < ordinals.length; i++) {
                    self.cards[ (i + (j*13) + (k*52)) ] = new c.Card(ordinals[i],suits[j]); 
                }
            }
        }
        
        // Shuffle the decks
        self.shuffleDecks();
    }
    
    self.rand = function(max) {
            return Math.floor(Math.random()*max);
    }         
    
    self.shuffleDecks = function () {
        var swap = function(i,j) {
            var temp = self.cards[j];
            self.cards[j] = self.cards[i];
            self.cards[i] = temp;
        }
        
        for(var j = 0; j<numDecks; j++) {
            for(var i = (numDecks * 51); i>=0; i--) {
                var r = self.rand(i);
                swap(i,r);
            }
        }
    }
    
    self.dealCard = function(resetDeck) {
        if (self.cards.length > 0)
            return self.cards.pop();
        else if (resetDeck == true){
            self.init();
            return self.cards.pop();
        }
    }
    
    self.cardsLeft = function() {
    	return self.cards.length;
    }
    
    self.dealCards = function(num) {
        var cards = new Array();
        for (var i = 0;  i<num ; i++) {
            cards.push(self.dealCard());
        }
        return cards;
    }
    
    self.init();
}
exports.Card = c.Card;
exports.Deck = Deck;