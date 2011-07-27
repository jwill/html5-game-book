var Ball = Class.create(Rectangle, {
    initialize: function($super){
        $super();
        this.width = 20;
        this.height = 20;
        this.color = "FF0000";
        this.setPosition(200, 130);
        this.direction = new Direction();
        this.direction.pickDirection();
    },
    checkCollisions: function(){
        // Collisions with paddles
        //check left
        if (this.y >= myGame.leftPaddle.getPosition().y && this.y <= myGame.leftPaddle.getPosition().y + myGame.leftPaddle.height) 
            if (this.x == myGame.leftPaddle.getPosition().x + myGame.leftPaddle.width) 
                this.direction.flipEastWest();
        // check right
        if (this.y >= myGame.rightPaddle.getPosition().y && this.y <= myGame.rightPaddle.getPosition().y + myGame.leftPaddle.height) 
            if (this.x == myGame.rightPaddle.getPosition().x - myGame.rightPaddle.width) 
                this.direction.flipEastWest();
        // Collisions with walls
        //if (this.x <= 0 || this.x >= game_width - 20) 
        //    this.direction.flipEastWest();
        if (this.y <= 0 || this.y >= game_height - 20) 
            this.direction.flipNorthSouth()
    },
    setPosition: function(x, y){
        this.x = x;
        this.y = y;
    },
    getPosition: function(){
        return {
            'x': this.x,
            'y': this.y
        }
    },
    resetBall: function(){
        this.setPosition(200, 130);
        this.direction.pickDirection();
    },
    update: function(){
        this.checkCollisions();
        pos = this.getPosition()
        
        this.setPosition(pos.x - 2 * this.direction.getX(), pos.y - 3 * this.direction.getY())
        if (this.x < 0) {
            myGame.ScoreBoard.scoreRight.incrementScore();
            this.resetBall();
        }
        else if (this.x > game_width) {
            myGame.ScoreBoard.scoreLeft.incrementScore()
            this.resetBall();
        }		
    }
});
