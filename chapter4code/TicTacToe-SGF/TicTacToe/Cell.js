TTT.Cell = Class.create(Rectangle, {
    initialize: function($super) {
        $super();
        
        // Set width and height to slightly less that
        // cell total size to simulate a grid
        this.width = TTT.CELL_SIZE - 2;
        this.height = TTT.CELL_SIZE - 2 ;
        this.color = "FFFFFF";    
    },
    toggleState: function() {
      x = this.pos.x;
      y = this.pos.y;
      if (TTT.isHumanTurn == true) {
        
      	// check for value already in square
        temp = TTT.gameBoard[x][y];
        if (temp == "") {
            this.color = TTT.colors.blue;
            TTT.gameBoard[x][y] = "X";
            this.changePlayer()
        } else {
          alert("Choose another square.");
        }
      } else {
        this.color = TTT.colors.red;
        TTT.gameBoard[x][y] = "O";
        this.changePlayer();
      }
    },
    changePlayer: function() {
      TTT.checkForWin(TTT.gameBoard);
      TTT.isHumanTurn = !TTT.isHumanTurn;
      if (TTT.isHumanTurn == false)
          TTT.game.emit("playerTurnOver");    
    }
});

TTT.initCells = function (values) {
    var x, y;
    // init array size
    x = TTT.GAME_WIDTH / TTT.CELL_SIZE;
    y = TTT.GAME_HEIGHT / TTT.CELL_SIZE;
    
    var count = 0;
    
    for (var i=0; i<x; i++) {
        for (var j=0; j<y; j++) {
            cell = new TTT.Cell();
            cell.x = i * TTT.CELL_SIZE;
            cell.y = j * TTT.CELL_SIZE;
            cell.pos = {x: i, y: j}
            TTT.cellContainer.push(cell);
        }
    }
    TTT.game.addComponent(TTT.cellContainer);
}

TTT.input.addListener("mousedown", function(evt) {
    // Get approximate cell
    calcX = Math.floor(evt.x / TTT.CELL_SIZE);
    calcY = Math.floor(evt.y / TTT.CELL_SIZE);
    
    clickedCell = TTT.cellContainer.findByPos(calcX, calcY);
    if (clickedCell !== undefined) {
        clickedCell.toggleState();
    }
});

TTT.checkForWin = function (board) {
	var lines = [
		[[0,0], [1,1], [2,2]],	// diagonals
		[[0,2], [1,1], [2,0]], 	
		[[0,0], [0,1], [0,2]],	// verticals
		[[1,0], [1,1], [1,2]],
		[[2,0], [2,1], [2,2]],
		[[0,0], [1,0], [2,0]],	// horizontals
		[[0,1], [1,1], [2,1]],
		[[0,2], [1,2], [2,2]]
	]
	
	winner = null;
	var emptySpaces = 0;
	for (var i = 0; i < lines.length; i++) {
		var line = lines[i];
		var a = board[line[0][0]][line[0][1]];
		var b = board[line[1][0]][line[1][1]];
		var c = board[line[2][0]][line[2][1]];
		
		if (a == "") emptySpaces++;
		if (b == "") emptySpaces++;
		if (c == "") emptySpaces++;
		
		if (a != "" && a == b && a == c)
			TTT.game.emit("winner",[a])
			//winner = a;
	}
	if (emptySpaces == 0) 
		TTT.game.emit("draw")
	
	return "";
}

// Retrieves a copy of the gameboard to run simulations on
TTT.cloneGameBoard = function() {
	var clone = [];
  for (var i = 0; i<3; i++) {
  	array = [];
    for (var j = 0; j<3; j++) {
    	array.push(TTT.gameBoard[i][j]);
    }
    clone.push(array);
  }
  return clone;
}

TTT.generateMovesFromBoard = function(board, player) {
		var emptySlots = []
		for (var i = 0; i<3; i++) {
			for (var j = 0; j<3; j++) {
				if (board[i][j] == "") {
					emptySlots.push([i,j]);
				}
			}
		}
		
		return emptySlots;
}

TTT.pickRandomMove = function () {
		moves = TTT.generateMovesFromBoard(TTT.gameBoard, "O");
		var num = Math.floor(Math.random()*moves.length);
		return TTT.cellContainer.findByPos(moves[num][0], moves[num][1]);
}

TTT.computerTurn =  function() {
	// Randomize starting position
	moves = TTT.generateMovesFromBoard(TTT.gameBoard, "O");
	clickedCell = null;
	if (moves.length == 9) 
		clickedCell = TTT.pickRandomMove();	
	else {
		mini = new MiniMax();
		move = mini.miniMax(TTT.gameBoard, "O");
		clickedCell = TTT.cellContainer.findByPos(move[0], move[1]);
		if (TTT.isGameOver) {
            clickedCell.toggleState();
            return;
        }
		if (clickedCell === undefined) {
			clickedCell = TTT.pickRandomMove();
		}
	}
	clickedCell.toggleState();
}

