class Directions {
  var directions;
  var currentDirection;
  
  void initDirections() {
    directions = [];
    directions.add({"code":"SE", "x":-1, "y":-1});   
    directions.add({"code":'SW','x':1,'y':-1});
    directions.add({"code":'NE','x':-1,'y':1});
    directions.add({"code":'NW','x':1,'y':1});
  }
  
  Directions() {
    initDirections();
    pickDirection();
    
  }
  
  void pickDirection () {
    var n = (Math.random() * this.directions.length).floor();
    this.currentDirection = this.directions[n.toInt()];
  }
  
  void flipNorthSouth() {
    var first = this.currentDirection['code'][0];
    if (first == 'N') {
      this.currentDirection = this.getDirection('S'+this.currentDirection['code'][1]);
    } else {
      this.currentDirection =  this.getDirection('N'+this.currentDirection['code'][1]);
    }

  }
  
  getDirection(code) {
    for (var i = 0; i < this.directions.length; i++) {
      var obj = this.directions[i];
      if (obj['code'] == code)
        return obj;
    }
    return null;    
  }
  
  void flipEastWest() {
    var second = this.currentDirection['code'][1];
    if (second == 'E') {
        this.currentDirection = this.getDirection(this.currentDirection['code'][0]+'W');
    } else {
        this.currentDirection = this.getDirection(this.currentDirection['code'][0]+'E');
    }
  }
  
  num getX() =>  this.currentDirection['x'];
  
  num getY() => this.currentDirection['y'];
  
  String toString() => this.currentDirection; 
}
