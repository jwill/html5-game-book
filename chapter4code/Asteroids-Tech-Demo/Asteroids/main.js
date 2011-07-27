// Import required classes
var Game = SGF.require("Game");
var Input = SGF.require("Input");

// Get a reference to our Game instance
var myGame = Game.getInstance();
// Get a reference to our game's Input instance
var myInput = myGame.input;

myGame.game_height = 600;
myGame.game_width = 600;

myGame.getScript("Asteroid.js", function(){
  for (var i = 0; i<5; i++) {
    myGame.drawNewAsteroid();
  }
});

myGame.drawNewAsteroid = function () {
  var a = new Asteroid();
  a.width = 100;
  a.height = 100;
  myGame.addComponent(a);
}

myGame.explodeAsteroids = function () {
  for (var i=0; i<myGame.components.length;i++){
    var k = myGame.components[i];
    k.explodeOrDestroy();
  }
}