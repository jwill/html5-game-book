#library('paddle');
#import('dart:html');

class Paddle {
  CanvasRenderingContext2D ctx;
  num height = 100;
  num width = 20;
  var color = "0011FF";
  bool isPlayerOne = true;
  num x,y;
  
  Paddle(this.ctx);
  
  void setPosition(x, y) {
    this.x = x;
    this.y = y;
  }
  
  getPosition() {
    return {'x':this.x, 'y':this.y};
  }
  
  void checkInput() {
    document.on.keyDown.add((KeyboardEvent event) {
      event.preventDefault();
      if (this.isPlayerOne == true) {
        if (event.keyCode == 87) {         // w key
          if (this.y > 0)
            this.y -= 0.05;
        } else if(event.keyCode == 83) {  // s key
          if (this.y < 400 - this.height) 
            this.y += 0.05;
        }
      } else {
        if (event.keyCode == 79) {         // o key 
          if (this.y > 0)
            this.y -= 0.05;
        } else if(event.keyCode == 76) {  // l key
          if (this.y < 400 - this.height) 
            this.y += 0.05;
        }
      }
    }, false);
  }
  
  void update() {
    this.checkInput();
  }
  
  void draw() {
    ctx.save();
    ctx.beginPath();
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.restore();
  }
  
}
