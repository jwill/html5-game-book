C4.Cell = Class.create(Rectangle, {
    initialize: function($super) {
        $super();
        
        // Set width and height to slightly less that
        // cell total size to simulate a grid
        this.width = C4.CELL_SIZE - 2;
        this.height = C4.CELL_SIZE - 2 ;
        this.color = "FFFFFF";    
    },
    toggleState: function() {
      if (C4.isHumanTurn == true)
        this.color = C4.colors.blue;
      else {
        this.color = C4.colors.red;
      }
      console.log("pos:"+this.pos.y);
    },
    update: function() {
    
    }
});


C4.initCells = function (values) {
    var x, y;
    // init array size
    x = C4.GAME_WIDTH / C4.CELL_SIZE;
    y = C4.GAME_HEIGHT / C4.CELL_SIZE;
    
    var count = 0;
    
    for (var i=0; i<x; i++) {
        for (var j=0; j<y; j++) {
            cell = new C4.Cell();
            cell.x = i * C4.CELL_SIZE;
            cell.y = j * C4.CELL_SIZE;
            cell.pos = {x: i, y: j}
            C4.cellContainer.push(cell);
        }
    }
    C4.game.addComponent(C4.cellContainer);
}

C4.input.addListener("mousedown", function(evt) {
    // Get approximate cell
    calcX = Math.floor(evt.x / C4.CELL_SIZE);
    calcY = Math.floor(evt.y / C4.CELL_SIZE);
    console.log(calcX + " " + calcY);
    
    clickedCell = C4.cellContainer.findByPos(calcX, calcY)//get((calcX * 7) + calcY);
    if (clickedCell !== undefined) {
        clickedCell.toggleState();
    }
      
    console.log(clickedCell);
});
    
