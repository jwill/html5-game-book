// Import required classes
var Game = SGF.require("Game");
var Input = SGF.require("Input");
var Rectangle = SGF.require("Rectangle");
var Container = SGF.require("Container");

var GOL = {};

// Get a reference to our Game instance
GOL.game = Game.getInstance();

// Get a reference to our game's Input instance
GOL.input = GOL.game.input;
GOL.game.setGameSpeed(15);

// Set game size


// Set game board and cell size
GOL.GAME_WIDTH = 400;
GOL.GAME_HEIGHT = 400;
GOL.CELL_SIZE = 40;

GOL.game.getScript("Set.js", function() {
GOL.game.getScript("CellContainer.js", function() {
GOL.game.getScript("Cell.js", function() {
    GOL.cellContainer = new GOL.CellContainer();

    GOL.initCells();
    SGF.log("after initCells");
    
});
});
});