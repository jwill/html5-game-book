// Import required classes
var Game = SGF.require("Game");
var Input = SGF.require("Input");
var Rectangle = SGF.require("Rectangle");
var Container = SGF.require("Container");
var Label = SGF.require("Label");

var TTT = {};

// Get a reference to our Game instance
TTT.game = Game.getInstance();
TTT.isGameOver = false;
// Get a reference to our game's Input instance
TTT.input = TTT.game.input;

TTT.isHumanTurn = false;

// Set game board and cell size
TTT.CELL_SIZE = 80;
TTT.GAME_WIDTH = TTT.CELL_SIZE * 3;
TTT.GAME_HEIGHT = TTT.CELL_SIZE * 3;
// Blue is human player
TTT.colors = {'red':"FF0000", 'blue':"0000FF"};

TTT.game.getScript("MiniMax.js", function() {
	TTT.game.getScript("CellContainer.js", function() {
		TTT.game.getScript("Cell.js", function() {
			TTT.cellContainer = new TTT.CellContainer();
	
			TTT.initCells();
			SGF.log("after initCells");
			
			var title = new Label()
			title.setText("Tic-Tac-Toe");
			title.x = 280;
			title.y = 25;
			title.width = 175;
			title.height = 50;
			title.size = 24;
			TTT.game.addComponent(title);
			
			TTT.message = new Label()
			TTT.message.setText("");
			TTT.message.x = 280;
			TTT.message.y = 100;
			TTT.message.width = 200;
			TTT.message.height = 50;
			TTT.message.size = 24;
			TTT.game.addComponent(TTT.message);
			
			// initialize game board to ease AI searching
			TTT.gameBoard = [];
			for (var i = 0; i<3; i++) {
				array = [];
				for (var j = 0; j<3; j++) {
					array.push("");
				}
				TTT.gameBoard.push(array);
			}
			
			TTT.game.addListener("playerTurnOver", function() { 
				TTT.computerTurn();
			});
			
			TTT.game.addListener("winner", function(args) { 
					if (args[0] == "X") {
						TTT.message.color = "0000FF"
					} else if (args[0] == "O")
						TTT.message.color = "FF0000"
					TTT.message.setText(args[0] + " wins!");
					TTT.isGameOver = true;
			});
			
			TTT.game.addListener("draw", function() {
					TTT.message.color = "FFFFFF"
					TTT.message.setText("Draw");
					TTT.isGameOver = true;
			});
			
			if (TTT.isHumanTurn == false) {
					TTT.computerTurn();
				}
		});
	});
});

