#library("ball");
#import("Paddle.dart");
#source("Directions.dart");


class Ball {
	var width, height, color, position; 
	num x, y;
	var direction;
	Paddle p1, p2;
	CanvasRenderingContext2D ctx;
	Ball(this.ctx) {
		print(ctx);
	  this.width = 20;
    this.height = 20;
    this.color = "FF0000";
    this.setPosition(200, 130);
    this.direction = new Directions();
    this.direction.pickDirection();
		
	}
	
	// Turn into one liner later
	void setPosition(xx, yy) {
		this.x = xx;
    this.y = yy;
	}
	
	getPosition() {
		return {'x': this.x, 'y': this.y};
	}
	
	void resetBall() {
		this.setPosition(200, 130);
    this.direction.pickDirection();
	}
	
	void draw() {
	  ctx.save();
	  ctx.beginPath();
	  ctx.arc(this.x, this.y, 20, 0, Math.PI*2, false);
	  ctx.fill();
	  ctx.restore();
	}
	
	void update() {
	  this.checkCollisions();
	  this.setPosition(this.x - 2 * this.direction.getX(), this.y - 3 * this.direction.getY());
	  if (this.x < 0) {
	    this.resetBall();
	    // score
	  } else if (this.x > 400) {
	    this.resetBall();
	    // score
	  }
	}
	
	void checkCollisions() {
	  // Collisions with paddles
    //check left
    if (this.y >= p1.getPosition()['y'] && this.y <= p1.getPosition()['y'] + p1.height) 
        if (this.x == p1.getPosition()['x'] + p1.width) 
            this.direction.flipEastWest();
    // check right
    if (this.y >= p2.getPosition()['y'] && this.y <= p2.getPosition()['y'] + p2.height) 
        if (this.x == p2.getPosition()['x'] - p2.width) 
            this.direction.flipEastWest();

	  if (this.y <= 0 +20 || this.y >= 400 - 20) {
	    this.direction.flipNorthSouth();
	  }
	}

}