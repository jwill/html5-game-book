// Import required classes
var Game = SGF.require("Game");
var Input = SGF.require("Input");
var Rectangle = SGF.require("Rectangle");
var Container = SGF.require("Container");
var Label = SGF.require("Label");

var C4 = {};

// Get a reference to our Game instance
C4.game = Game.getInstance();

// Get a reference to our game's Input instance
C4.input = C4.game.input;

C4.isHumanTurn = false;

// Set game board and cell size
C4.CELL_SIZE = 80;
C4.GAME_WIDTH = C4.CELL_SIZE * 7;
C4.GAME_HEIGHT = C4.CELL_SIZE * 6;
C4.colors = {'red':"FF0000", 'blue':"0000FF"};

C4.game.getScript("CellContainer.js", function() {
C4.game.getScript("Cell.js", function() {
    C4.cellContainer = new C4.CellContainer();

    C4.initCells();
    SGF.log("after initCells");
    
    var title = new Label()
    title.setText("Connect 4");
    title.x = 620;
    title.y = 25;
    title.width = 125;
    title.height = 50;
    title.size = 24;
    C4.game.addComponent(title);
    
});
});
