/*
    Defines the Card object for Node.
    Contains no view logic
    @author jwill
*/
function Card(ordinal, suit) {    
    var meta;
    var ord;
    var suit;    
    var xPos;
    var yPos;
    var frontShown = false;
    var cardFrontPath;
    var cardBackPath;
    
    // 90 dpi height and width
    var width = 169;
    var height = 245;
    
    var self = this;
    
    self.init = function() {        
        self.ord = ordinal;
        self.suit = suit;
        self.cardBackPath = "images/90dpi/back.png";
        self.cardFrontPath = "images/90dpi/"+self.ord+"_"+self.suit+".png";       
        self.meta = new Object();
    }
    
    
    
    self.discard = function() {

    	self.meta['hidden'] = true;
    }
    
    self.toString = function() {
        return "Card:"+self.ord+"-"+self.suit;
    }
    
    self.equals = function(obj2) {
        if (obj2 instanceof Card) {
            if (self.ord == obj2.ord) {
                if (self.suit == obj2.suit) {
                    if (self.meta.equals(obj2.meta)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    
    self.shallowEquals = function(obj2) {
        if (obj2 instanceof Card) {
            if (self.ord == obj2.ord) {
                if (self.suit == obj2.suit) {
                    return true;
                }
            }
        }
        return false;
    }
    
    self.init();
}
exports.Card = Card;