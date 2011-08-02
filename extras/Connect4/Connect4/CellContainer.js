C4.CellContainer = Class.create(Container, {
    initialize: function($super) {
        $super();
        this.width = C4.GAME_WIDTH;
        this.height = C4.GAME_HEIGHT;
    },
    push: function($super,cell) {
        this.addComponent(cell);
    },
    get: function(val) {
        return this.components[val];
    },
    update: function() {
      
    },
    findByPos: function (x,y) {
      for (var i = 0; i < this.components.length; i++) {
        var comp = this.components[i]
        if (comp.pos.x == x && comp.pos.y == y)
          return comp
      }
      return undefined
    }
    
})