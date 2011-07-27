var Direction = Class.create({
  initialize: function () {
    this.directions = [
      {code:'SE','x':-1,'y':-1},
      {code:'SW','x':1,'y':-1},
      {code:'NE','x':-1,'y':1},
      {code:'NW','x':1,'y':1},
     ]
    
    this.currentDirection = undefined;
  },
  pickDirection: function() {
    var num = Math.floor(Math.random() * this.directions.length)
    this.currentDirection = this.directions[num]    
  },
  flipNorthSouth: function () {
    var first = this.currentDirection.code.charAt(0)
    
    if (first == 'N') {
      this.currentDirection = this.getDirection('S'+this.currentDirection.code.charAt(1));
    } else {
      this.currentDirection =  this.getDirection('N'+this.currentDirection.code.charAt(1));
    }
  },
  flipEastWest: function (direction) {
    var second = this.currentDirection.code.charAt(1)
    if (second == 'E') {
      this.currentDirection = this.getDirection(this.currentDirection.code.charAt(0)+'W');
    } else {
      this.currentDirection = this.getDirection(this.currentDirection.code.charAt(0)+'E');
    }
  },
  getX: function () {
    return this.currentDirection.x;
  },
  getY: function () {
    return this.currentDirection.y;
  },
  getDirection: function (code) {
    for (var i = 0; i < this.directions.length; i++) {
      var obj = this.directions[i];
      if (obj.code === code)
        return obj;
    }
    return undefined;
  }
});