function Set() {
    if ( !(this instanceof arguments.callee) ) {
        return new arguments.callee(arguments); 
    }
    
    var rawArray;
    
    var self = this;
    
    self.init = function() {
        self.rawArray = new Array();
    }
    
    self.add = function(object) {
        if (self.contains(object) == undefined) {
            self.rawArray.push(object);
        }
        if (self.rawArray.length == 2) {
            setTimeout(game.checkForMatch, 1000);            
        }
    }
    
    self.get = function(index) {
        return self.rawArray[index];
    }
    
    self.remove = function(object) {
        var index = self.contains(object);
        if (index != undefined) {
            self.rawArray.remove(index);
        }
    }
    
    // Returns index of object or null
    self.contains = function(card) {
        for (var i = 0; i < self.rawArray.length; i++ ) {
            var card2 = self.rawArray[i];
            if (card2.ord == card.ord && card2.suit == card.suit) {
                if (card.meta.equals(card2.meta))
                    return i;    
            }
        }
        
        return undefined;
    }
    
    
    
    self.init();
}