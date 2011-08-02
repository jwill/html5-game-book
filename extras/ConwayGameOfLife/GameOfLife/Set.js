 var Set = Class.create({
    initialize: function() {
        this.rawArray = []
    },
    add: function(object) {
        if (this.contains(object) === undefined) {
            this.rawArray.push(object);
        }
    },
    push: function(object) {
        if (this.contains(object) === undefined) {
            this.rawArray.push(object)
        }
    },
    get: function($super, index) {
        return this.rawArray[index];
    },
    size: function() {
        return this.rawArray.length;
    },
    each: function(func) {
        this.rawArray.each(func)
    },
    remove: function(object) {
        var index = self.contains(object);
        if (index != undefined) {
            this.rawArray.remove(index);
        }
    },
    
    // Returns index of object or null
    contains: function(obj) {
        for (var i = 0; i < this.rawArray.length; i++ ) {
            var obj2 = this.rawArray[i];
            if (obj.pos.x == obj2.pos.x && obj.pos.y == obj.pos.y) {
                return i;
            }
        }
        
        return undefined;
    }
});