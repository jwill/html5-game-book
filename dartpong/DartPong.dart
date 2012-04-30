#import('dart:html');
#import('Ball.dart');
#import('Paddle.dart');
#import('ScoreBoard.dart');

class DartPong {
  CanvasElement canvas;
  CanvasRenderingContext2D ctx;
  static num width = 400; 
  static num height = 400;
  Ball ball;
  Paddle paddle1, paddle2;
  ScoreBoard scoreboard;
  DartPong() {
    canvas = document.query("canvas");
    canvas.width = width;
    canvas.height = height;
    ctx = canvas.getContext("2d");
   // ctx.beginPath();
   // ctx.fillRect(0, 0, 200, 200);
   // ctx.fill();
    
  }

  void run() {
    ball = new Ball(ctx);
    paddle1 = new Paddle(ctx);
    paddle1.setPosition(0,150);
    paddle2 = new Paddle(ctx);
    paddle2.setPosition(width - paddle2.width, 150);
    paddle2.isPlayerOne = false;
    ball.p1 = paddle1;
    ball.p2 = paddle2;
    scoreboard = new ScoreBoard(ctx);
    animate(0);
  }
  
  bool animate(time) {
    window.webkitRequestAnimationFrame(animate);
    this.render();
  }
  
  void render() {
    ctx.clearRect(0, 0, width, height);
    scoreboard.draw();
    ball.update();
    paddle1.update();
    paddle2.update();
    ball.draw();
    paddle1.draw();
    paddle2.draw();
  }
}

void main() {
  new DartPong().run();
}
