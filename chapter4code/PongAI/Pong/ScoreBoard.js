var Container = SGF.require('Container')
var Rectangle = SGF.require('Rectangle')



myGame.ScoreBoard = new Container()
myGame.ScoreBoard.height = 400;
myGame.ScoreBoard.width = 400;

var font = myGame.getFont('../fonts/AnnieUseYourTelescope.ttf')

// game label
var title = new Label({
    width: 100,
    height: 50
});
title.x = 150;
title.y = 0;
title.size = 40;
title.font = this.font;
title.setText("PONG");
title.color = "FFFFFF"

var divider = new Rectangle();
divider.width = 1;
divider.height = 50;
divider.color = "FFFFFF"
divider.x = 190;
divider.y = 35;

myGame.ScoreBoard.scoreLeft = new ScoreLabel(font);
myGame.ScoreBoard.scoreRight = new ScoreLabel(font);

myGame.ScoreBoard.scoreLeft.setPosition(160, 40);
myGame.ScoreBoard.scoreRight.setPosition(205, 40);

myGame.ScoreBoard.addComponent(title);
myGame.ScoreBoard.addComponent(divider);
myGame.ScoreBoard.addComponent(myGame.ScoreBoard.scoreLeft);
myGame.ScoreBoard.addComponent(myGame.ScoreBoard.scoreRight);
