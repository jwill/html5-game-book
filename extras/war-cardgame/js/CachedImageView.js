function CachedImageView(image, width, height) {
    Node.call(this);
    this.img = image;
    this.loaded = true;
    this.width = 10;
    this.height = 10;
    
    //@property x  The Y coordinate of the upper left corner of the image.
    this.x = 0.0;
    this.setX = function(x) { this.x = x;   this.setDirty();  return this;  };
    this.getX = function() { return this.x; };
    
    //@property y  The Y coordinate of the upper left corner of the image.
    this.y = 0.0;
    this.setY = function(y) {  this.y = y;  this.setDirty();  return this;  };
    this.getY = function() { return this.y; };
    
    var self = this;
    
    this.hasChildren = function() { return false; }
    
    self.width = width;
    self.height = height;
    self.setDirty();
    
    this.draw = function(ctx) {
        //self.loaded = false;
        if(self.loaded) {
            ctx.drawImage(self.img,self.x,self.y);
        } else {
            ctx.fillStyle = "red";
            ctx.fillRect(self.x,self.y,100,100);
        }
        self.clearDirty();
    };
    this.contains = function(x,y) {
        if(x >= this.x && x <= this.x + this.width) {
            if(y >= this.y && y<=this.y + this.height) {
                return true;
            }
        }
        return false;
    };
    this.getVisualBounds = function() {
        return new Bounds(this.x,this.y,this.width,this.height);
    };
    return true;
};
CachedImageView.extend(Node);