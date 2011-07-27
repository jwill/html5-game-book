var Sprite = SGF.require("Sprite");
var Spriteset = SGF.require("Spriteset");

var Asteroid = Class.create(Sprite, {
  initialize: function ($super) {
    var s = new Spriteset("./Asteroids/images/asteroid.png", 500, 389);
    $super(s, {
      width: 100,
      height: 100
    });
    this.generation = 0;
    this.pickSpeedAndDirection();
  },
  pickSpeedAndDirection: function () {
    this.dx = Math.round(Math.random() * 10) 
    this.dy = Math.round(Math.random() * 10)
    if (this.dx <= 2)
      this.dx = 4;
    if (this.dy <= 2)
      this.dy = 4;
  },
  setPosition: function(x, y){
        this.x = x;
        this.y = y;
  },
  update: function ($super) {
    $super();
    this.x = this.x +this.dx;
    
    this.y = this.y + this.dy;
    if (new Date().getTime() % 5 == 0)
      this.rotation = this.rotation + .05;
    this.checkForWrap()
  },
  render: function($super, interpolation) {
        $super(interpolation);
  },
  checkForWrap: function () {
    // wrapping in x directions
    if (this.x > myGame.game_width) {
      // redraw on the left
      this.x = -2;
    } else if (this.x < 0) {
      // redraw on the right
      this.x = myGame.game_width + 5;
    }
    
    // wrapping in y directions
    if (this.y > myGame.game_height) {
      // redraw on the left
      this.y = -2;
    } else if (this.y < 0) {
      // redraw on the right
      this.y = myGame.game_height + 5;
    }
  },
  spawnAsteroids: function (generation, size, num) {
    for (var i = 0; i<num; i++) {
        var asteroid = new Asteroid();
        asteroid.width = size;
        asteroid.height = size;
        asteroid.x = this.x;
        asteroid.y = this.y
        asteroid.generation = generation;
        asteroid.pickSpeedAndDirection();
        myGame.addComponent(asteroid);
    }
  },
  explodeOrDestroy: function() {
    if (this.generation == 0) {
      // remove this asteroid and create 3 smaller ones
      this.spawnAsteroids(1, 75, 3);
      myGame.removeComponent(this);
    } else if (this.generation == 1) {
      // remove this asteroid and create 2 smaller ones
      this.spawnAsteroids(2, 50, 2);
      myGame.removeComponent(this);
    } else myGame.removeComponent(this);
  }
});