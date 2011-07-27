GOL.Cell = Class.create(Rectangle, {
    initialize: function($super) {
        $super();
        this.aliveState = "DEAD";
        this.nextTickState = "DEAD";
        
        // Set width and height to slightly less that
        // cell total size to simulate a grid
        this.width = GOL.CELL_SIZE - 2;
        this.height = GOL.CELL_SIZE - 2 ;
        colors = {off:"FFFFFF", on:"00FF00"};
        this.color = colors.off;    
    },
    toggleState: function () {
        if (GOL.isRunning !== true) {
            if (this.aliveState == "ALIVE") {
              this.color = colors.off;
              this.aliveState = "DEAD"
            } else {
              this.color = colors.on
              this.aliveState = "ALIVE"
            }
        }
    },
    finalizeState: function () {
        this.aliveState = this.nextTickState;
        this.nextTickState = "";
        if (this.aliveState == "ALIVE")
            this.color = colors.on;
        else this.color = colors.off;
    },
    findAdjacentCells: function() {
        // values to calculate adjacent cells
        adj = [
        [-1,-1],[0,-1],[1,-1],
        [-1,0],[1,0],
        [-1,1],[0,1],[1,1]
        ];
        
        adjacentCells = new Set()
        
        for (var i = 0; i<adj.length; i++) {
            calcX = this.x + (adj[i][0] * GOL.CELL_SIZE);
            calcY = this.y + (adj[i][1] * GOL.CELL_SIZE);
        
            val = ((this.pos.x + adj[i][0])* 10) + (this.pos.y +adj[i][1])
            if (calcX <= GOL.GAME_WIDTH && calcX >= 0) {
              if (calcY <= GOL.GAME_HEIGHT && calcY >=0) {
                if (GOL.cellContainer.components[val] !== undefined) {
                    foundCell = GOL.cellContainer.components[val]
                    console.log(foundCell.aliveState);
                    //   foundCell.color = "000060";
                    if (foundCell.aliveState == "ALIVE")
                      adjacentCells.push(foundCell);
                }
              }
            }
        }
        
        return adjacentCells.size();
        
    },
    calculateNextState: function() {
        aliveCells = this.findAdjacentCells();
        
        
        neighborCount = aliveCells;
        if (neighborCount == 2) {
            console.log(aliveCells);
            console.log(this);
        }
        
        // console.log(this);
        if ((neighborCount == 2) && (this.aliveState == "ALIVE")) {
            console.log("staying alive");
            this.nextTickState = "ALIVE"
        } else if ((neighborCount == 3) && (this.aliveState == "ALIVE")) {
            console.log("staying alive");
            this.nextTickState = "ALIVE";
        } else if ((neighborCount == 3) && (this.aliveState == "DEAD")) {
            console.log("coming alive");
            this.nextTickState = "ALIVE";
        } else if ((neighborCount > 3) || (neighborCount < 2)){
            this.nextTickState = "DEAD";  
        }
    }
});


GOL.initCells = function (values) {
    var x, y;
    // init array size
    x = this.GAME_WIDTH / this.CELL_SIZE;
    y = this.GAME_HEIGHT / this.CELL_SIZE;
    
    var count = 0;
    
    for (var i=0; i<x; i++) {
        for (var j=0; j<y; j++) {
            cell = new GOL.Cell();
            cell.x = i * this.CELL_SIZE;
            cell.y = j * this.CELL_SIZE;
            cell.pos = {x: i, y: j}
            GOL.cellContainer.push(cell);
        }
    }
    GOL.game.addComponent(GOL.cellContainer);

    if (values == null) {
                console.log("y"+y);
    }

}

GOL.input.addListener("mousedown", function(evt) {
    // Get approximate cell
    calcX = Math.floor(evt.x / GOL.CELL_SIZE);
    calcY = Math.floor(evt.y / GOL.CELL_SIZE);
    console.log(calcX + " " + calcY);
    
    clickedCell = GOL.cellContainer.get((calcX * 10) + calcY);
    if (clickedCell !== undefined) {
        clickedCell.toggleState();
    }
      
    console.log(clickedCell);
});
    
