GOL.CellContainer = Class.create(Container, {
    initialize: function($super) {
        $super();
        this.width = GOL.GAME_WIDTH;
        this.height = GOL.GAME_HEIGHT;
    },
    push: function($super,cell) {
        this.addComponent(cell);
    },
    get: function(val) {
        return this.components[val];
    },
    changeCellStates: function() {
        this.components.each(function(cell) {
            cell.calculateNextState();
//            cell.finalizeState();
        });
        this.components.each(function(cell) {
            cell.finalizeState();
        });
    },
    update: function() {
        // cycle through all the cells and then draw them.
        if (GOL.isRunning === true) {
          console.log("update cells");
          this.components.each(function(cell) {
              console.log(cell);
          });
        } else {
          // do nothing
        }
    }
    
})