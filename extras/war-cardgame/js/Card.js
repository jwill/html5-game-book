/*
    Defines the Card object.
    @author jwill
*/
function Card(ordinal, val, suit) {
    if ( !(this instanceof arguments.callee) ) {
        return new arguments.callee(arguments); 
    }
    
    var meta;
    var ord;
    var suit; 
    var val;
    var xPos;
    var yPos;
    var cardFront, cardBack;
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
        self.val = val;
        self.cardBackPath = "images/90dpi/back.png";
        self.cardFrontPath = "images/90dpi/"+self.ord+"_"+self.suit+".png";       
        self.meta = new Object();
    }
    
    self.findXPos = function() {
    }
    
    self.findYPos = function() {
    }
    
    
    self.drawCard = function() { 
        //self.findXPos()
        //self.findYPos()
        if (self.cardBack == undefined) {
            self.cardBack = new ImageView( self.cardBackPath);
        //    self.cardBack.setX(self.xPos);
        //    self.cardBack.setY(self.yPos);
        }
        if (self.cardFront == undefined) {
        		self.cardFront = new ImageView( self.cardFrontPath);
        //    self.cardFront.setX(self.xPos);
        //    self.cardFront.setY(self.yPos);
        }
        
        self.flipCard();
        
    }
    
    self.trashCard = function() {
        self.cardBack.remove();
        self.cardFront.remove();
    }
    
    self.flipCard = function(frontShown) {        
        if (self.meta['hidden'] == true)
            return
            
        self.frontShown = !self.frontShown;
        
        if (self.frontShown) {
      //      self.cardBack.animate({opacity:0.0}, 1000)
      //      self.cardFront.animate({opacity:1}, 1000)
        } else {
      //      self.cardFront.animate({opacity:0.0}, 1000)
      //      self.cardBack.animate({opacity:1}, 1000)
        }        
        
    }
    
    self.discard = function() {
       // self.cardFront.animate({opacity:0.0}, 1000, "bounce")     
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
