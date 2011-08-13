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
    
    self.testdrawCard = function () {        
        var rect = paper.rect(self.xPos+100, self.yPos+30, 60, 50).attr("fill","#FFF");
        var t = paper.text(self.xPos+130, self.yPos+50, self.ord+"-"+self.suit)
    }
    
    self.findXPos = function() {
    		// could do variable spacing here
    		self.xPos = 10 + (self.positionInHand *189)  
    }
    
    self.findYPos = function() {
        // InnerHeight - the height of the card
        var h = window.paper.height - 245 - 10 ;
        self.yPos = h;
    }
    
    self.drawHoldButton = function() {
        var x = self.xPos + 55
        var y = self.yPos - 50
        if (self.holdButton) self.holdButton.remove();
        if (self.state) {
            self.holdButton = new Button({x:5, y:20, fontSize:20, text:"Held", color:'red', dims:{x:55, y:35}})
        } else {
            self.holdButton = new Button({x:5, y:20, fontSize:20, text:"Hold", color:'blue', dims:{x:55, y:35}})
        }
            
        self.holdButton.translate(x, y)
    }
    
    
    self.drawCard = function() { 
        self.findXPos()
        self.findYPos()
        if (self.cardBack == undefined)
            self.cardBack = paper.image( self.cardBackPath, self.xPos, self.yPos, 169, 245)
        if (self.cardFront == undefined)
        self.cardFront = paper.image(self.cardFrontPath, self.xPos, self.yPos, 169, 245)
        self.cardFront.attr("opacity", 0.0)
        self.flipCard();
        self.cardFront.attr({"cursor":"pointer"})
         self.cardFront.click(function() {
            // toggle state for card
            self.state = !self.state;
            self.drawHoldButton();
        });
       self.drawHoldButton();
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
            self.cardBack.animate({opacity:0.0}, 1000)
            self.cardFront.animate({opacity:1}, 1000)
        } else {
            self.cardFront.animate({opacity:0.0}, 1000)
            self.cardBack.animate({opacity:1}, 1000)
        }        
        
    }
    
    self.discard = function() {
        self.cardFront.animate({opacity:0.0}, 1000, "bounce")     
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