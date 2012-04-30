#library('scoreboard');
#import('dart:html');

class ScoreBoard {
  num height = 600;
  num width = 600;
  
  CanvasRenderingContext2D ctx;
  ScoreBoard(this.ctx) {
      
  }
  
  drawTitle() {
    ctx.save();
    ctx.fillStyle ="blue";
    ctx.font ="35pt Arial";
    ctx.fillText("PONG", 125, 75);
    ctx.restore();
    
  }
  
  drawDivider() {
    ctx.save();
    ctx.fillStyle = "black";
    ctx.fillRect(195, 85, 5, 280);
    ctx.restore();
  }
  
  drawScore() {
    ctx.save();
    // TODO
    ctx.restore();
  }
  
  draw() {
    drawTitle();
    drawDivider();
  }
}
