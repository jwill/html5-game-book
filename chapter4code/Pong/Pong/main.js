// Import required classes
var Game = SGF.require("Game");
var Input = SGF.require("Input");
var Rectangle = SGF.require("Rectangle");
var Label = SGF.require("Label");

// Get a reference to our Game instance
var myGame = Game.getInstance();
// Get a reference to our game's Input instance
var myInput = myGame.input;

var game_height = 400;
var game_width = 400;

myGame.getScript("Paddle.js", function(){
    myGame.getScript("Ball.js", function(){
        myGame.getScript("Direction.js", function(){
            myGame.getScript("ScoreLabel.js", function(){
                myGame.getScript("ScoreBoard.js", function(){
                    myGame.addComponent(myGame.ScoreBoard);
                    
                    
                    myGame.ball = new Ball();
                    myGame.addComponent(myGame.ball);
                    
                    // left paddle
                    myGame.leftPaddle = new Paddle();
                    myGame.leftPaddle.setPosition(0, 150);
                    myGame.addComponent(myGame.leftPaddle)
                    
                    // right paddle
                    myGame.rightPaddle = new Paddle();
                    myGame.rightPaddle.setPosition(game_width - myGame.rightPaddle.width, 150);
                    myGame.rightPaddle.setIsPlayerOne(false);
                    myGame.addComponent(myGame.rightPaddle);
                    
                });
            });
        });
    });
});

myGame.newGame = function(){
    myGame.ScoreBoard.scoreLeft.setText("0");
    myGame.ScoreBoard.scoreRight.setText("0");
    myGame.ball.resetBall();
    this.start();
}

