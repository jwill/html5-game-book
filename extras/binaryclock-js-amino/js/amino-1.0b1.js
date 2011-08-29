/*
@overview Amino: JavaScript Scenegraph

Amino is a scenegraph for drawing 2D graphics in JavaScript with the
HTML 5 Canvas API. By creating a tree of nodes, you can draw shapes, text, images special effects; complete with transforms and animation.
Amino takes care of all rendering, animation, and event handling
so you can build *rich* interactive graphics with very little code.
Using Amino is much more convenient than writing canvas code by hand.

Here's a quick example:    

    <canvas id="can" width="200" height="200"></canvas>
    <script>
    
    //attach a runner to the canvas
    var can = document.getElementById("can");
    var runner = new Runner().setCanvas(can);
    
    //create a rect and a circle
    var r = new Rect().set(0,0,50,50).setFill("green");
    var c = new Circle().set(100,100,30).setFill("blue");
    
    //add the shapes to a group
    var g = new Group().add(r).add(c);
    
    //make the rectangle go left and right every 5 seconds
    var anim = new Anim(g,"x",0,150,5);
    runner.addAnim(anim);
    
    //set the group as the root of the scenegraph, then start
    runner.root = g;
    runner.start();
    
    </script>

A note on properties. Most objects have properties like `x` or `width`.
Properties are accessed with getters.  For example, to access the `width`
property on a rectangle, call `rect.getWidth()`. Properties are set 
with setters. For example, to set the `width` property
on a rectangle, call `rect.setWidth(100)`. Most functions, especially 
property setters, are chainable. This means you
can set a bunch of properties at once like this:

    var c = new Rect()
        .setX(50)
        .setY(50)
        .setWidth(100)
        .setHeight(200)
        .setFill("green")
        .setStrokeWidth(5)
        .setStroke("black")
        ;
    
@end
*/

var win = window;
//@language javascript
var ROTATE_BACKWARDS = false;
if (window.PalmSystem) {
    ROTATE_BACKWARDS = true;
}



// 'extend' is From Jo lib, by Dave Balmer
// syntactic sugar to make it easier to extend a class
Function.prototype.extend = function(superclass, proto) {
    // create our new subclass
	this.prototype = new superclass();

	// optional subclass methods and properties
	if (proto) {
		for (var i in proto)
			this.prototype[i] = proto[i];
	}
};


var DEBUG = true;
var tabcount = 0;
function indent() {
    tabcount++;
}
function outdent() {
    tabcount--;
}
function p(s) {
    if(DEBUG) {
        var tab = "";
        for(i=0;i<tabcount;i++) {
            tab = tab + "  ";
        }
        console.log(tab+s);
    }
}




/*
@class Node The base class for all nodes. All nodes have a parent and can potentially have children if they implement *hasChildren*.
@category shape
*/
__node_hash_counter = 0;
function Node() {
    __node_hash_counter++;
    this._hash = __node_hash_counter;
    var self = this;
    
    //@property parent Get the parent of this node, or null if there is no parent.  A node not yet put into the scene may not have a parent. The top most node may not have a parent.
    this.parent = null;
    this.setParent = function(parent) { this.parent = parent; return this; };
    this.getParent = function() { return this.parent; };
    
    //@property visible Indicates if the node is visible. Non-visible nodes are not drawn on screen.      non visible nodes cannot intercept click events.
    this.visible = true;
    this.setVisible = function(visible) {
        self.visible = visible;
        self.setDirty();
        return self;
    };
    this.isVisible = function() {
        return this.visible;
    };
    
    //@property cached Indicates if the node should be automatically cached an a buffer. false by default
    this.cached = false;
    this.setCached = function(cached) {
        self.cached = cached;
        self.setDirty();
        return self;
    };
    this.isCached = function() {
        return self.cached;
    };
    
    
    // @property blocksMouse Indicates if this node will block mouse events from hitting nodes beneath it.
    this.blocksMouse = false;
    this.isMouseBlocked = function() {
        return this.blocksMouse;
    };
    this.setMouseBlocked = function(m) {
        this.blocksMouse = m;
        return this;
    };
    
    this.dirty = true;
    //@doc Marks this node as dirty, so it is scheduled to be redrawn
    this.setDirty = function() {
        this.dirty = true;
        if(this.getParent()) {
            this.getParent().setDirty();
        }
    };
    //@doc Returns if this node is dirty, meaning it still needs to be completely redrawn
    this.isDirty = function() {
        return self.dirty;
    };
    //@doc Clears the dirty bit. usually this is called by the node itself after it redraws itself
    this.clearDirty = function() {
        self.dirty = false;
    };
    //@method by default nodes don't contain anything
    this.contains = function(x,y) { return false; }
    //@method by default nodes don't have children
    this.hasChildren = function() { return false; }
    return true;
}

/*
@class Bounds  Represents the maximum bounds of something, usually the visible bounds of a node.
@category resource
*/
function Bounds(x,y,w,h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    
    
    //@property x Return the x coordinate of the bounds.
    this.getX = function() { return this.x; };
    //@property y Return the y coordinate of the bounds.
    this.getY = function() { return this.y; };
    //@property width Return the width of the bounds.
    this.getWidth = function() { return this.w; }
    //@property height Return the height of the bounds.
    this.getHeight = function() { return this.h; }
    
    return true;
};

/*
@class Buffer An offscreen area that you can draw into. Used for special effects and caching.
@category resource
*/
function Buffer(w,h) {
    var self = this;    
    //@property width  The width of the buffer, set at creation time.
    this.w = w;
    this.getWidth = function() { return this.w; }
    
    //@property height  The height of the buffer, set at creation time.
    this.h = h;
    this.getHeight = function() { return this.h; }
    
    this.buffer = document.createElement("canvas");
    this.buffer.width = this.w;
    this.buffer.height = this.h;
    
    //@doc get the Canvas 2D context of the buffer, so you can draw on it
    this.getContext = function() { return self.buffer.getContext('2d'); }
    
    //@doc Get an canvas ImageData structure.
    this.getData = function() {
        var c = this.getContext();
        var data = c.getImageData(0,0,this.getWidth(), this.getHeight());
        return data;
    };
    
    //@method Return the *red* component at the specified x and y.
    this.getR = function(data, x, y) {
        var pi = x+y*data.width;
        return data.data[pi*4+0];
    };
    
    //@method Return the *green* component at the specified x and y.
    this.getG = function(data, x, y) {
        var pi = x+y*data.width;
        return data.data[pi*4+1];
    };
    
    //@method Return the *blue* component at the specified x and y.
    this.getB = function(data, x, y) {
        var pi = x+y*data.width;
        return data.data[pi*4+2];
    };
    
    //@method Return the *alpha* component at the specified x and y.
    this.getA = function(data, x, y) {
        var pi = x+y*data.width;
        return data.data[pi*4+3];
    };
    
    //@method Set the red, green, blue, and alpha components at the specified x and y.
    this.setRGBA = function(data,x,y,r,g,b,a) {
        var pi = (x+y*this.getWidth())*4;
        //console.log("pi = " + pi);
        data.data[pi+0] = r; //alpha
        data.data[pi+1] = g; //red
        data.data[pi+2] = b; //green
        data.data[pi+3] = a; //blue
        return this;
    };
    //@method Set the data structure back into the canvas. This should be the same value you got from *getData()*.
    this.setData = function(data) {
        this.getContext().putImageData(data,0,0);
        return this;
    };
    //@method Clear the buffer with transparent black.
    this.clear = function() {
        var ctx = this.getContext();
        ctx.clearRect(0,0,this.getWidth(),this.getHeight());
        return this;
    };
    return true;
};

/* 
@class BufferNode A node which draws its child into a buffer. Use it to cache children which are expensive to draw.
@category misc
*/
function BufferNode(n) {
	Node.call(this);
	this.node = n;
    this.node.setParent(this);
    this.buf = null;//= new Buffer(200,200);
    var self = this;
    this.draw = function(ctx) {
        var bounds = this.node.getVisualBounds();
        if(!this.buf) {
            this.buf = new Buffer(bounds.getWidth(),bounds.getHeight());
        }
        //redraw the child only if it's dirty
        if(this.isDirty()) {
            var ctx2 = this.buf.getContext();
            ctx2.save();
            ctx2.translate(-bounds.getX(),-bounds.getY());
            this.node.draw(ctx2);
            ctx2.restore();
        }
        ctx.save();
        ctx.translate(bounds.getX(),bounds.getY());
        ctx.drawImage(this.buf.buffer,0,0);
        ctx.restore();
        this.clearDirty();
    };
    return true;
};
BufferNode.extend(Node);




/*
@class Transform Transforms the child inside of it with a translation and/or rotation.
@category misc
*/
function Transform(n) {
    Node.call(this);
    this.node = n;
    this.node.setParent(this);
    var self = this;
    
    //@property translateX translate in the X direction
    this.translateX = 0;
    this.setTranslateX = function(tx) {
        self.translateX = tx;
        self.setDirty();
        return self;
    };
    this.getTranslateX = function() {
        return this.translateX;
    };
    
    //@property translateY translate in the Y direction
    this.translateY = 0;
    this.setTranslateY = function(ty) {
        this.translateY = ty;
        this.setDirty();
        return this;
    };
    this.getTranslateY = function() {
        return this.translateY;
    };
    
    //@property scaleX scale in the X direction
    this.scaleX = 1;
    this.setScaleX = function(sx) {
        this.scaleX = sx;
        this.setDirty();
        return this;
    };
    this.getScaleX = function() {
        return this.scaleX;
    };
        
        
    //@property scaleY scale in the X direction
    this.scaleY = 1;
    this.setScaleY = function(sy) {
        this.scaleY = sy;
        this.setDirty();
        return this;
    };
    this.getScaleY = function() {
        return this.scaleY;
    };
    
    //@property rotate set the rotation, in degrees
    this.rotate = 0;
    this.setRotate = function(rotate) {
        this.rotate = rotate;
        this.setDirty();
        return this;
    };
    this.getRotate = function() {
        return this.rotate;
    };
    
    this.contains = function(x,y) {
        return false;
    };
    this.hasChildren = function() {
        return true;
    };
    this.childCount = function() {
        return 1;
    };
    this.getChild = function(n) {
        return this.node;
    };
    
    this.convertToChildCoords = function(x,y) {
        var x1 = x-this.translateX;
        var y1 = y-this.translateY;
        var a = -this.rotate * Math.PI/180;
        var x2 = x1*Math.cos(a) - y1*Math.sin(a);
        var y2 = x1*Math.sin(a) + y1*Math.cos(a);
        x2 = x2/this.scaleX;
        y2 = y2/this.scaleY;
        return [x2,y2];
    };
    
    this.draw = function(ctx) {
        ctx.save();
        ctx.translate(self.translateX,this.translateY);
        var r = this.rotate % 360;
        if(ROTATE_BACKWARDS) {
            r = 360-r;
        }
        ctx.rotate(r*Math.PI/180.0,0,0);
        if(self.scaleX != 1 || self.scaleY != 1) {
            ctx.scale(self.scaleX,self.scaleY);
        }
        this.node.draw(ctx);
        ctx.restore();
        this.clearDirty();
    };
    return true;
}
Transform.extend(Node);





/*
@class Group A parent node which holds an ordered list of child nodes. It does not draw anything by itself, but setting visible to false will hide the children.
@category shape
*/

function Group() {
    Node.call(this);
    this.children = [];
    this.parent = null;
    var self = this;
    
    //@property x set the x coordinate of the group.
    this.x = 0;
    this.setX = function(x) {
        self.x = x;
        return self;
    };
    this.getX = function() {
        return self.x;
    };
    
    //@property y set the y coordinate of the group.
    this.y = 0;
    this.setY = function(y) {
        self.y = y;
        return self;
    };
    this.getY = function() {
        return self.y;
    };
    
    this.opacity = 1.0;
    this.setOpacity = function(o) {
        self.opacity = o;
        return self;
    };
    this.getOpacity = function() {
        return self.opacity;
    };
    
    //@method Add the child `n` to this group.
    this.add = function(n) {
        self.children[self.children.length] = n;
        n.setParent(self);
        self.setDirty();
        return self;
    };
    //@method Remove the child `n` from this group.
    this.remove = function(n) {
        var i = self.children.indexOf(n);
        if(i >= 0) {
            self.children.splice(i,1);
            n.setParent(null);
        }
        self.setDirty();
        return self;
    };
    
    this.draw = function(ctx) {
        if(!self.isVisible()) return;
        indent();
        var ga = ctx.globalAlpha;
        ctx.globalAlpha = self.opacity;
        ctx.translate(self.x,self.y);
        for(var i=0; i<self.children.length;i++) {
            self.children[i].draw(ctx);
        }
        ctx.translate(-self.x,-self.y);
        ctx.globalAlpha = ga;
        outdent();
        this.clearDirty();
    };
    //@method Remove all children from this group.
    this.clear = function() {
        self.children = [];
        self.setDirty();
        return self;
    };
    //@method Always returns false. You should call contains on the children instead.
    this.contains = function(x,y) {
        return false;
    };
    //@method Always returns true, whether or not it actually has children at the time.
    this.hasChildren = function() {
        return true;
    };
    //@method Convert the `x` and `y` in to child coordinates.
    this.convertToChildCoords = function(x,y) {
        return [x-self.x,y-self.y];
    };
    //@method Returns the number of child nodes in this group.
    this.childCount = function() {
        return self.children.length;
    };
    //@method Returns the child node at index `n`.
    this.getChild = function(n) {
        return self.children[n];
    };
    return true;
};
Group.extend(Node, {});





/*
@class ImageView  A node which draws an image. Takes a string URL in it's constructor. ex: new ImageView("blah.png")
@category shape
*/
function ImageView(url) {
    Node.call(this);
    this.src = url;
    this.img = new Image();
    this.loaded = false;
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
    
    this.img.onload = function() {
        console.log("loaded");
        self.loaded = true;
        self.setDirty();
        self.width = self.img.width;
        self.height = self.img.height;
        console.log("self = " + self.width + " " + self.height);
    }
    this.img.src = url;
    
    this.hasChildren = function() { return false; }
    
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
ImageView.extend(Node);




/* 
@class MEvent The base mouse event. Has a reference to the node that the event was on (if any), and the x and y coords. Will have more functionality in the future. 
@category misc
*/
function MEvent() {
    this.node = null;
    this.x = -1;
    this.y = -1;
    var self = this;
    //@method Get the node that this mouse event actually happened on.
    this.getNode = function() {
        return this.node;
    };
    this.getX = function() {
        return this.x;
    };
    this.getY = function() {
        return this.y;
    };
    return true;
}

function KEvent() {
    this.key = 0;
}




/* 
    adapted from robert penner's easing equations.
    http://www.robertpenner.com/easing/
*/
var LINEAR = function(t) {
    return t;
}
var EASE_IN = function(t) {
    var t2 = t*t;
    return t2;
};
var EASE_OUT = function(t) {
    t = 1-t;
    var t2 = t*t;
    return -t2+1;
};
var EASE_IN_OVER = function(t) {
    var s = 1.70158;
    var t2 = t*t*((s+1)*t-s);
    return t2;
};
var EASE_OUT_OVER = function(t) {
    var s = 1.70158;
    t = 1-t;
    var t2 = t*t*((s+1)*t-s);
    return -t2+1;
};
/*
//x(t) = x0 cos(sqrt(k/m)*t)
//k = spring constant (stiffness)
//m = mass 
var SPRING = function(t) {
    var k = 0.01;
    var m = 1;
    return Math.cos(t*Math.PI*2);//Math.sqrt(k/m)*t);
};
*/

/* 
@class PropAnim A PropAnim is a single property animation. It animates a property on an object over time, optionally looping and reversing direction at the end of each loop (making it oscillate).
@category animation
*/
function PropAnim(n,prop,start,end,duration) {
    this.node = n;
    this.prop = prop;
    this.started = false;
    this.startValue = start;
    this.endValue = end;
    this.duration = duration;
    this.loop = false;
    this.autoReverse = false;
    this.forward = true;
    this.dead = false;
    
    
    var self = this;
    
    //@doc Indicates if this animation has started yet
    this.isStarted = function() {
        return self.started;
    };
    
    //@property loop  Determines if the animation will loop at the end rather than stopping.
    this.setLoop = function(loop) {
        this.loop = loop;
        return this;
    };
    
    //@property autoReverse Determines if the animation will reverse direction when it loops. This means it will oscillate.
    this.setAutoReverse = function(r) {
        this.autoReverse = r;
        return this;
    };
    
    this.start = function(time) {
        self.startTime = time;
        self.started = true;
        self.node[self.prop] = self.startValue;
    };
    
    this.setValue = function(tvalue) {
        value = (self.endValue-self.startValue)*tvalue + self.startValue;
        self.node[self.prop] = value;
        self.node.setDirty();
    };
    
    this.update = function(time) {
        var elapsed = time-self.startTime;
        var fract = 0.0;
        fract = elapsed/(duration*1000);
        if(fract > 1.0) {
            if(self.loop) {
                self.startTime = time;
                if(self.autoReverse) {
                    self.forward = !self.forward;
                }
                fract = 0.0;
            } else {
                //set the final value
                self.setValue(1.0);
                self.dead = true;
                return;
            }
        }
        
        if(!self.forward) {
            fract = 1.0-fract;
        }
        //var value = (self.endValue-self.startValue)*fract + self.startValue;
        //var value = self.tween(fract,self.startValue,self.endValue);
        var tvalue = self.tween(fract);
        self.setValue(tvalue);
    }
    this.tween = LINEAR;
    this.setTween = function(func) {
        this.tween = func;
        return this;
    };
    return true;
}    

/*
@class PathAnim  Animates a shape along a path. The Path can be composed of lines or curves. PathAnim can optionally loop or reverse direction at the end. Create it with the node, path, and duration like this: `new PathAnim(node,path,10);`
@category animation
*/
function PathAnim(n,path,duration) {
    this.node = n;
    this.path = path;
    this.duration = duration;
    this.loop = false;
    this.forward = true;
    this.dead = false;
    var self = this;
    //@method Returns true if the animation is currently running.
    this.isStarted = function() {
        return self.started;
    };
    //@property loop Indicates if the animation should repeat when it reaches the end.
    this.setLoop = function(loop) {
        this.loop = loop;
        return this;
    };
    this.tween = LINEAR;
    this.setTween = function(func) {
        this.tween = func;
        return this;
    };
    this.start = function(time) {
        self.started = true;
        self.startTime = time;
        //        self.node[self.prop] = self.startValue;
        return self;
    };
    this.update = function(time) {
        var elapsed = time-self.startTime;
        var fract = 0.0;
        fract = elapsed/(duration*1000);
        if(fract > 1.0) {
            if(self.loop) {
                self.startTime = time;
                if(self.autoReverse) {
                    self.forward = !self.forward;
                }
                fract = 0.0;
            } else {
                self.dead = true;
                return;
            }
        }

        if(!self.forward) {
            fract = 1.0-fract;
        }

        var tvalue = self.tween(fract);
        //value = (self.endValue-self.startValue)*tvalue + self.startValue;
        var pt = self.path.pointAtT(tvalue);
        if(self.node.setX){
            console.log("setting x");
            self.node.setX(pt[0]);
            self.node.setY(pt[1]);
        }
        if(self.node.setTranslateX) {
            self.node.setTranslateX(pt[0]);
            self.node.setTranslateY(pt[1]);
        }
        self.node.setDirty();
    }
    return true;
}



var ADB = {
    dline:"",
    avgfps:0,
    getAverageFPS : function() {
        return ADB.avgfps;
    },
    debugLine : function(s) {
        ADB.dline = s;
    }
}


/* 
@class Runner The core of Amino. It redraws the screen, processes events, and executes animation. Create a new instance of it for your canvas, then call `start()` to start the event loop.
@category misc
*/
function Runner() {
    this.root = "";
    this.background = "gray";
    this.anims = [];
    this.callbacks = [];
    this.listeners = {};
    this.masterListeners = [];
    this.tickIndex = 0;
    this.tickSum = 0;
    this.tickSamples = 30;
    this.tickList = [];
    this.lastTick = 0;
    this.fps = 60;
    this.dirtyTrackingEnabled = true;
    this.clearBackground = true;
    this.DEBUG = true;
    
    var self = this;

    //@property root  The root node of the scene.
    this.setRoot = function(r) {
        self.root = r;
        return self;
    };
    //@property background The background color of the scene.  May be set to null or "" to not draw a background.
    this.setBackground = function(background) {
        self.background = background;
        return self;
    };
    
    //@property fps  The target FPS (Frames Per Second). The system will try to hit this FPS and never go over it.
    this.setFPS = function(fps) {
        self.fps = fps;
        return self;
    };
    
    function attachEvent(node,name,func) {
        self.masterListeners.push(func);
        if(node.addEventListener) {
            node.addEventListener(name,func,false);
        } else if(node.attachEvent) {
            node.attachEvent(name,func);
        }
    };
    
    this.calcLocalXY = function(canvas,event) {
        var docX = -1;
        var docY = -1;
        if (event.pageX == null) {
            // IE case
            var d= (document.documentElement && document.documentElement.scrollLeft != null) ?
                 document.documentElement : document.body;
             docX= event.clientX + d.scrollLeft;
             docY= event.clientY + d.scrollTop;
        } else {
            // all other browsers
            docX= event.pageX;
            docY= event.pageY;
        }        
        docX -= canvas.offsetLeft;
        docY -= canvas.offsetTop;
        return [docX,docY];
    };
    //@property canvas  The canvas element that the scene will be placed in.
    this.setCanvas = function(canvas) {
        self.canvas = canvas;
        var _mouse_pressed = false;
        var _drag_target = null;
        attachEvent(canvas,'mousedown',function(e){
            var xy = self.calcLocalXY(canvas,e);
            _mouse_pressed = true;
            //send target node event first
            var node = self.findNode(self.root,xy[0],xy[1]);
            //p("---------- found node --------");
            //console.log(node);
            var evt = new MEvent();
            evt.node = node;
            evt.x = xy[0];
            evt.y = xy[1];
            if(node) {
                var start = node;
                _drag_target = node;
                while(start) {
                    self.fireEvent("MOUSE_PRESS",start,evt);
                    //p("blocked = " + start.isMouseBlocked());
                    if(start.isMouseBlocked()) return;
                    start = start.getParent();
                }
            }
            //send general events next
            self.fireEvent("MOUSE_PRESS",null,evt);
            //p("---------------");
        });
        attachEvent(canvas,'mousemove',function(e){
            if(_mouse_pressed) {
                var xy = self.calcLocalXY(canvas,e);
                var node = self.findNode(self.root,xy[0],xy[1]);
                var evt = new MEvent();
                
                //redirect events to current drag target, if applicable
                if(_drag_target) {
                    node = _drag_target;
                }
                evt.node = node;
                evt.x = xy[0];
                evt.y = xy[1];
                if(node) {
                    var start = node;
                    while(start) {
                        self.fireEvent("MOUSE_DRAG",start,evt);
                        if(start.isMouseBlocked()) return;
                        start = start.getParent();
                    }
                }
                //send general events next
                self.fireEvent("MOUSE_DRAG",null,evt);
            }
        });
        attachEvent(canvas, 'mouseup', function(e) {
            _mouse_pressed = false;
            _drag_target = false;
            //send target node event first
            var xy = self.calcLocalXY(canvas,e);
            var node = self.findNode(self.root,xy[0],xy[1]);
            //console.log(node);
            var evt = new MEvent();
            evt.node = node;
            evt.x = xy[0];
            evt.y = xy[1];
            if(node) {
                var start = node;
                while(start) {
                    self.fireEvent("MOUSE_RELEASE",start,evt);
                    if(start.isMouseBlocked()) return;
                    start = start.getParent();
                }
            }
            //send general events next
            self.fireEvent("MOUSE_RELEASE",null,evt);
        });
        attachEvent(document, 'keydown', function(e) {
            var evt = new KEvent();
            evt.key = e.keyCode;
            self.fireEvent("KEY_PRESSED",null,evt);
        });
        attachEvent(document, 'keyup', function(e) {
            var evt = new KEvent();
            evt.key = e.keyCode;
            self.fireEvent("KEY_RELEASED",null,evt);
        });
        attachEvent(window, 'onUnload', function(e) {
            console.log("got Unload");
        });
        attachEvent(window, 'onunload', function(e) {
            console.log("got unload");
        });
        return self;
    };
    
    this.findNode = function(node,x,y) {
        //p("findNode:" + node._hash + " " + x + " " + y);
        //console.log(node);
        //don't descend into invisible nodes
        //p("visible = " + node.isVisible());
        if(!node.isVisible()) {
            return null;
        }
        if(node.contains(x,y)) {
            //p("node contains it " + node._hash);
            return node;
        }
        if(node.hasChildren()) {
            //p("node has children");
            var nc = node.convertToChildCoords(x,y);
            indent();
            //descend from front to back
            for(var i=node.childCount()-1; i>=0; i--) {
                //p("looking at child: " + node.getChild(i)._hash);
                //console.log(node.getChild(i));
                var n = self.findNode(node.getChild(i),nc[0],nc[1]);
                if(n) {
                    //p("backing up. matched " + n._hash);
                    outdent();
                    return n;
                }
            }
            outdent();
        }
        //p("returning null");
        return null;
    };
    
    this.fireEvent = function(type,key,e) {
        //p("firing event for key: " + key + " type = " + type);
        //console.log(key);
        var k = key;
        if(key) {
            k = key._hash;
        } else {
            k = "*";
        }
        //p("Using real key: " + k);
        //p("firing event for key: " + k + " type = " + type);
        
        if(self.listeners[k]) {
            if(self.listeners[k][type]) {
                for(var i=0; i<self.listeners[k][type].length; i++) {
                    var l = self.listeners[k][type][i];
                    //p("listener = " + l);
                    l(e);
                }
            }
        }
    };

    this.drawScene = function(ctx) {
        //fill the background
        if(self.clearBackground) {
            if(self.transparentBackground) {
                ctx.clearRect(0,0,self.canvas.width,self.canvas.height);
            } else {
                ctx.fillStyle = self.background;
                ctx.fillRect(0,0,self.canvas.width,self.canvas.height);
            }
        }
        
        //draw the scene
        if(self.root) {
            self.root.draw(ctx);
        }
    }        
    
    
    
    this.doNext = function() {
        if(window.webkitRequestAnimationFrame) {
            window.webkitRequestAnimationFrame(self.update);
            return;
        }
        if(window.mozRequestAnimationFrame) {
            window.mozRequestAnimationFrame(self.update);
            return;
        }
        console.log("can't repaint! not webkit");
        setTimeout(self.update,1000/self.fps);
        return;
    };
    
    this.update = function() {
        
        var time = new Date().getTime();
        self.processInput(time);
        self.processAnims(time);
        self.processCallbacks(time);
        var ctx = self.canvas.getContext("2d");
        
        self.processRepaint(time, ctx);
        self.processDebugOverlay(time, ctx);
        //drop to 4fps if in bg
        if(self.inBackground) {
            setTimeout(function() { self.doNext(); }, 1000);
        } else {
            self.doNext();
        }
    };
    
    this.interv = -1;
    this.inBackground = false;
    //@doc Start the scene. This is usually the last thing you call in your setup code.
    this.start = function() {
        //palm specific
        if (window.PalmSystem) {
            window.PalmSystem.stageReady();
            Mojo = {
                stageActivated: function() {
                    self.inBackground = false;
                },
                stageDeactivated: function() {
                    self.inBackground = true;
                },
            };
        }
        
        self.lastTick = new Date().getTime();
        self.doNext();
        //self.interv = setInterval(this.update,1000/self.fps);
    };
    
    
    this.stop = function() {
        clearInterval(self.interv);
        console.log("stopped the repaint");
    };
    this.cleanup = function() {
        console.log("cleaning up stuff");
        self.anims = [];
        self.callbacks = [];
        
        for(var i=0; i<self.listeners.length; i++) {
            self.listeners[i] = [];
        }
        self.listeners = [];
        self.root = null;
        for(var i=0; i<self.masterListeners.length; i++) {
            console.log("removing master listener");
            self.canvas.removeEventListener(self.masterListeners[i]);
        }
        self.canvas = null;
    };
    
    //@doc Add an animation to the scene.
    this.addAnim = function(anim) {
        this.anims[this.anims.length] = anim;
        return this;
    };
    
    //@doc Add a function callback to the scene. The function will be called on every frame redraw.
    this.addCallback = function(callback) {
        this.callbacks[this.callbacks.length] = callback;
        return this;
    };
    
    //@doc Listen to a particular type of event on a particular target. *eventTarget* may be null or "*" to listen on all nodes.
    this.listen = function(eventType, eventTarget, callback) {
        var key = "";
        if(eventTarget) {
            key = eventTarget._hash;
        } else {
            key = "*";
        }
        
        if(!this.listeners[key]) {
            this.listeners[key] = [];
        }
        if(!this.listeners[key][eventType]) {
            this.listeners[key][eventType] = [];
        }
        
        this.listeners[key][eventType].push(callback);
        //p("added listener. key = "+ key + " type = " + eventType + " = " + callback);
    };
    
    //@doc Do the function later, when the next frame is drawn.
    this.doLater = function(callback) {
        callback.doLater = true;
        callback.done = false;
        self.addCallback(callback);
        return self;
    };
    
    //@method gets the drawing context of the canvas. You *must* have already called _setCanvas()_ first.
    this.getContext = function() {
        return self.canvas.getContext('2d');
    };
    
    
    this.processInput = function() {
    };
    this.processAnims = function(time) {
        //process animation
        for(i=0;i<self.anims.length; i++) {
            var a = self.anims[i];
            if(a.dead) continue;
            if(!a.isStarted()) {
                a.start(time);
                continue;
            }
            a.update(time);
        }
    };
    
    this.processCallbacks = function(time) {
        //process callbacks
        for(i=0;i<self.callbacks.length;i++) {
            var cb = self.callbacks[i];
            if(!cb.done) {
                cb();
            }
            if(cb.doLater) {
                cb.doLater = false;
                cb.done = true;
            }
        }
    };
    
    this.processRepaint = function(time, ctx) {
        if(self.dirtyTrackingEnabled) {
            if(self.root && self.root.isDirty()) {
                self.drawScene(ctx);
            }
        } else {
            self.drawScene(ctx);
        }
    };
    
    this.processDebugOverlay = function(time, ctx) {
        if(self.DEBUG) {
            ctx.save();
            ctx.translate(0,self.canvas.height-60);
            ctx.fillStyle = "gray";
            ctx.fillRect(0,-10,200,70);
            //draw a debugging overlay
            ctx.fillStyle = "black";
            ctx.fillText("timestamp " + new Date().getTime(),10,0);
            
            //calc fps
            var delta = time-self.lastTick;
            self.lastTick = time;
            if(self.tickList.length <= self.tickIndex) {
                self.tickList[self.tickList.length] = 0;
            }
            self.tickSum -= self.tickList[self.tickIndex];
            self.tickSum += delta;
            self.tickList[self.tickIndex]=delta;
            ++self.tickIndex;
            if(self.tickIndex>=self.tickSamples) {
                self.tickIndex = 0;
            }
            var fpsAverage = self.tickSum/self.tickSamples;
            ctx.fillText("last msec/frame " + delta,10,10);
            ctx.fillText("last frame msec " + (new Date().getTime()-time),10,20);
            ctx.fillText("avg msec/frame  " + (fpsAverage).toPrecision(3),10,30);
            ctx.fillText("avg fps = " + ((1.0/fpsAverage)*1000).toPrecision(3),10,40);
            ctx.fillText("" + ADB.dline,10,50);
            ctx.restore();
            ADB.avgfps = ((1.0/fpsAverage)*1000);
        }
        
    };

    
    return true;
}


/*
@class Util  A class with some static utility functions.
@category misc
*/
function Util() {
    //@doc convert the canvas into a PNG encoded data url. Use this if your browser doesn't natively support data URLs
    this.toDataURL = function(canvas) {
	    console.log(" $$ Canvas = " + canvas);
	    var canWidth = canvas.width;
	    var canHeight = canvas.height;
        var c = canvas.getContext('2d');
        var data = c.getImageData(0,0,canWidth, canHeight);
        var p = new PNGlib(canWidth, canHeight, 2); 
        for (var j = 0; j < canHeight; j++) {
            for (var i = 0; i < canWidth; i++) {
                var n = i+j*canWidth;
                var pi = n*4; //pixel index 
                var r = data.data[pi+0];
                var g = data.data[pi+1];
                var b = data.data[pi+2];
                var a = data.data[pi+3];
                p.buffer[p.index(i,j)] = p.getColor(r,g,b,a);
            }
        }
        
        var url = "data:image/png;base64,"+p.getBase64();
        return url;
    };
    
    return true;
};





/*
@class SaturationNode A parent node which adjusts the saturation of its child. Uses a buffer internally.
@category effect
*/
function SaturationNode(n) {
    Node.call(this);
	this.node = n;
    this.node.setParent(this);
    this.buf1 = null;
    this.buf2 = null;
    
    //@property saturation value between 0 and 1
    this.saturation = 0.5;
    this.setSaturation = function(s) {
        this.saturation = s;
        this.setDirty();
        return this;
    };
    this.getSaturation = function() {
        return this.saturation;
    };
    var self = this;
    this.draw = function(ctx) {
        var bounds = this.node.getVisualBounds();
        if(!this.buf1) {
            this.buf1 = new Buffer(
                bounds.getWidth()
                ,bounds.getHeight()
                );
            this.buf2 = new Buffer(
                bounds.getWidth()
                ,bounds.getHeight()
                );
        }
        
        //redraw the child only if it's dirty
        if(this.isDirty()) {
            //render child into first buffer
            this.buf1.clear();
            var ctx1 = this.buf1.getContext();
            ctx1.save();
            ctx1.translate(
                -bounds.getX()
                ,-bounds.getY());
            this.node.draw(ctx1);
            ctx1.restore();

            //apply affect from buf1 into buf2
            this.buf2.clear();
            this.applyEffect(this.buf1,this.buf2,5);
            //buf1->buf2
        }
        ctx.save();
        ctx.translate(bounds.getX(),bounds.getY());
        ctx.drawImage(this.buf2.buffer,0,0);
        ctx.restore();
        
        this.clearDirty();
    };
    this.applyEffect = function(buf, buf2, radius) {
        console.log("buf = " + buf + " "+ buf.getWidth());
        var data = buf.getData();
        var s = radius*2;
        var size = 0;
        var scale = 1-this.getSaturation();
        for(var x = 0+size; x<buf.getWidth()-size; x++) {
            for(var y=0+size; y<buf.getHeight()-size; y++) {
                var r = buf.getR(data,x,y);
                var g = buf.getG(data,x,y);
                var b = buf.getB(data,x,y);
                var a = buf.getA(data,x,y);
                //var avg = (r+g+b)/3;
                var v = r*0.21+g*0.71+b*0.07;
                r = r*(1-scale)+v*scale;
                g = g*(1-scale)+v*scale;
                b = b*(1-scale)+v*scale;
                buf2.setRGBA(data,x,y,r,g,b,a);
            }
        }
        /*
        for(var i = 0; i<buf2.getHeight(); i++) {
            buf2.setRGBA(data,0,i,0xFF,0xFF,0xFF,0xFF);
            buf2.setRGBA(data,buf2.getWidth()-1,i,0xFF,0xFF,0xFF,0xFF);
        }
        for(var i = 0; i<buf2.getWidth(); i++) {
            buf2.setRGBA(data,i,0,0xFF,0xFF,0xFF,0xFF);
            buf2.setRGBA(data,i,buf2.getHeight()-1,i,0xFF,0xFF,0xFF,0xFF);
        }
        */
        buf2.setData(data);        
    };
    return true;
}
SaturationNode.extend(Node);


function WorkTile(left,top,width,height, src, dst) {
    this.left = left;
    this.top = top;
    this.width = width;
    this.height = height;
    this.src = src;
    this.dst = dst;
    this.srcData = null;
    this.getData = function() {
        if(this.srcData == null) {
            this.srcData = this.src.getContext().getImageData(this.left,this.top,this.width,this.height);
        }
        return this.srcData;
    };
    this.getR = function(x,y) {
        var pi = x+y*this.width;
        return this.srcData.data[pi*4+0];
    };
    this.getG = function(x,y) {
        var pi = x+y*this.width;
        return this.srcData.data[pi*4+1];
    };
    this.getB = function(x,y) {
        var pi = x+y*this.width;
        return this.srcData.data[pi*4+2];
    };
    this.getA = function(x,y) {
        var pi = x+y*this.width;
        return this.srcData.data[pi*4+3];
    };
    this.saveData = function() {
        dst.getContext().putImageData(this.srcData,this.left,this.top);
    }        
    return true;
}

/*
@class BackgroundSaturationNode A parent node which adjusts the saturation of its child. Uses a buffer internally.
@category effect
*/
function BackgroundSaturationNode(n) {
    Node.call(this);
	this.node = n;
    this.node.setParent(this);
    this.buf1 = null;
    this.buf2 = null;
    
    //@property x left edge of the node
    this.x = 0;
    this.setX = function(x) {
        this.x = x;
        return this;
    };
    //@property y top edge of the node
    this.y = 0;
    this.setY = function(y) {
        this.y = y;
        return this;
    };
    
    //@property saturation value between 0 and 1
    this.saturation = 0.5;
    this.setSaturation = function(s) {
        this.saturation = s;
        if(this.saturation > 1.0) this.saturation = 1.0;
        if(this.saturation < 0.0) this.saturation = 0.0;
        this.setDirty();
        return this;
    };
    this.getSaturation = function() {
        return this.saturation;
    };
    
    //@property brightness value between -1 and 1
    this.brightness = 0;
    this.setBrightness = function(b) {
        this.brightness = b;
        if(this.brightness < -1.0) this.brightness = -1.0;
        if(this.brightness > 1.0) this.brightness = 1.0;
        this.setDirty();
        return this;
    };
    this.getBrightness = function() { return this.brightness; };

    //@property contrast value between 0 and 10. default is 1
    this.contrast = 0;
    this.setContrast = function(c) {
        this.contrast = c;
        if(this.contrast < 0.0) this.contrast = 0.0;
        if(this.contrast > 10.0) this.contrast = 10.0;
        this.setDirty();
        return this;
    };
    this.getContrast = function() { return this.contrast; }
        
    
    this.inProgress = false;
    this.workX = 0;
    this.workY = 0;
    this.startTime = 0;
    
    var self = this;
    this.draw = function(ctx) {
        var bounds = this.node.getVisualBounds();
        if(!this.buf1 || bounds.getWidth() != this.buf1.getWidth()) {
            this.buf1 = new Buffer(
                bounds.getWidth()
                ,bounds.getHeight()
                );
            this.buf2 = new Buffer(
                bounds.getWidth()
                ,bounds.getHeight()
                );
        }
        
        //redraw the child only if it's dirty
        if(this.isDirty()) {
            this.startTime = new Date().getTime();
            //render child into first buffer
            this.buf1.clear();
            var ctx1 = this.buf1.getContext();
            ctx1.save();
            ctx1.translate(
                -bounds.getX()
                ,-bounds.getY());
            this.node.draw(ctx1);
            ctx1.restore();

            //apply affect from buf1 into buf2
            //this.buf2.clear();
            //console.log("marking in progress again");
            this.workX = 0;
            this.workY = 0;
            this.inProgress = true;
        }
        
        if(this.inProgress) {
            var start = new Date().getTime();
            while(new Date().getTime()-start < 1000/40) {
                var workSize = 32;
                var tile = new WorkTile(this.workX,this.workY,workSize,workSize, this.buf1, this.buf2);
                this.applyEffect(tile);
                this.workX+=workSize;
                if(this.workX+workSize > this.buf1.getWidth()) {
                    this.workX = 0;
                    this.workY+=workSize;
                }
                if(this.workY+workSize > this.buf1.getHeight()) {
                    this.inProgress = false;
                    var endTime = new Date().getTime();
                    if(bounds.getWidth() > 100) {
                        //win.alert("done!: " + (endTime-this.startTime));
                    }
                    break;
                }
            }
        }
        ctx.save();
        ctx.translate(bounds.getX()+self.x,bounds.getY()+self.y);
        ctx.drawImage(this.buf2.buffer,0,0);
        ctx.restore();
        
        this.clearDirty();
    };
    
    this.applyEffect = function(tile) {
        var buf = tile.src;
        var buf2 = tile.dst;
        var workSize = tile.width;
        var data = tile.getData();
        var d = data.data;
        
        var tw = tile.width;
        var th = tile.height;
        
        var scale = 1-this.getSaturation();
        var bright = this.getBrightness()*256;
        var contrast = this.getContrast();
        var scale1 = 1-scale;
        var r = 0;
        var g = 0;
        var b = 0;
        var a = 0;
        for(var x=0; x<tw; x++) {
            for(var y=0; y<th; y++) {
                var pi = (x+y*tw)*4;
                r = d[pi+0];
                g = d[pi+1];
                b = d[pi+2];
                a = d[pi+3];
                var v = r*0.21+g*0.71+b*0.07;
                var vs = v*scale;
                r = r*scale1+vs;
                g = g*scale1+vs;
                b = b*scale1+vs;
                //brightness
                r += bright;
                g += bright;
                b += bright;
                //contrast
                r = (r-0x7F)*contrast+0x7F;
                g = (g-0x7F)*contrast+0x7F;
                b = (b-0x7F)*contrast+0x7F;
                //clamp
                if(r > 0xFF) r = 0xFF;
                if(g > 0xFF) g = 0xFF;
                if(b > 0xFF) b = 0xFF;
                if(r < 0x00) r = 0x00;
                if(g < 0x00) g = 0x00;
                if(b < 0x00) b = 0x00;
                
                a = 0xFF;
                d[pi+0] = r;
                d[pi+1] = g;
                d[pi+2] = b;
                d[pi+3] = a;
            }
        }
        tile.saveData();
    };
    return true;
}
BackgroundSaturationNode.extend(Node);

/*
@class BlurNode A parent node which blurs its child.
@category effect
*/
function BlurNode(n) {
	this.node = n;
	console.log("n = " + n);
    Node.call(this);
    if(n) n.setParent(this);
    this.buf1 = null;
    this.buf2 = null;
    
    //@property blurRadius the radius of the blur
    this.blurRadius = 3;
    this.setBlurRadius = function(r) { this.blurRadius = r; return this; }
    
    var self = this;
    this.draw = function(ctx) {
        var bounds = this.node.getVisualBounds();
        if(!this.buf1) {
            this.buf1 = new Buffer(
                bounds.getWidth()+this.blurRadius*4
                ,bounds.getHeight()+this.blurRadius*4
                );
            this.buf2 = new Buffer(
                bounds.getWidth()+this.blurRadius*4
                ,bounds.getHeight()+this.blurRadius*4
                );
        }
        
        //redraw the child only if it's dirty
        if(this.isDirty()) {
            //render child into first buffer
            this.buf1.clear();
            var ctx1 = this.buf1.getContext();
            ctx1.save();
            ctx1.translate(
                -bounds.getX()+this.blurRadius*2
                ,-bounds.getY()+this.blurRadius*2);
            this.node.draw(ctx1);
            ctx1.restore();

            //apply affect from buf1 into buf2
            this.buf2.clear();
            this.applyEffect(this.buf1,this.buf2,this.blurRadius);
            //buf1->buf2
        }
        ctx.save();
        ctx.translate(bounds.getX(),bounds.getY());
        ctx.drawImage(this.buf2.buffer,0,0);
        ctx.restore();
        
        this.clearDirty();
    };
    this.applyEffect = function(buf, buf2, radius) {
        var data = buf.getData();
        var s = radius*2;
        var size = s/2;
        for(var x = 0+size; x<buf.getWidth()-size; x++) {
            for(var y = 0+size; y<buf.getHeight()-size; y++) {
                var r = 0;
                var g = 0;
                var b = 0;
                var a = 0;
                for(var ix=x-size; ix<=x+size; ix++) {
                    for(var iy=y-size;iy<=y+size;iy++) {
                        r += buf.getR(data,ix,iy);
                        g += buf.getG(data,ix,iy);
                        b += buf.getB(data,ix,iy);
                        a += buf.getA(data,ix,iy);
                    }
                }
                var divisor = s*s;
                r = r/divisor;
                g = g/divisor;
                b = b/divisor;
                a = a/divisor;
                //r = 0x00; g = 0x00; b = 0x00;
                a// = a*this.blurOpacity;
                buf2.setRGBA(data,x,y,r,g,b,a);                
            }
        }
        
        /*
        for(var x = 0+size; x<buf.getWidth()-size; x++) {
            for(var y=0+size; y<buf.getHeight()-size; y++) {
                var r = buf.getR(data,x,y);
                var g = buf.getG(data,x,y);
                var b = buf.getB(data,x,y);
                var a = buf.getA(data,x,y);
                buf2.setRGBA(data,x,y,r,g,b,a);
            }
        }
        */
        
        /*
        for(var i = 0; i<buf2.getHeight(); i++) {
            buf2.setRGBA(data,0,i,0xFF,0xFF,0xFF,0xFF);
            buf2.setRGBA(data,buf2.getWidth()-1,i,0xFF,0xFF,0xFF,0xFF);
        }
        for(var i = 0; i<buf2.getWidth(); i++) {
            buf2.setRGBA(data,i,0,0xFF,0xFF,0xFF,0xFF);
            buf2.setRGBA(data,i,buf2.getHeight()-1,i,0xFF,0xFF,0xFF,0xFF);
        }
        */
        
        buf2.setData(data);        
    };
    return true;
};
BlurNode.extend(Node);

/*
@class ShadowNode A parent node which draws a shadow under its child. Uses a buffer internally.
@category effect
*/
function ShadowNode(n) {
    console.log("initing shadow node");
	BlurNode.call(this,n);
	
	//@property offsetX The X offset of the shadow
    this.offsetX = 0;
    this.setOffsetX = function(x) { this.offsetX = x; return this; }
    
    //@property offsetY The Y offset of the shadow
    this.offsetY = 0;
    this.setOffsetY = function(y) { this.offsetY = y; return this; }
    
    //@property blurRadius The radius of the shadow area
    this.blurRadius = 3;
    this.setBlurRadius = function(r) { this.blurRadius = r; return this; }
    
    //@property blurOpacity The opacity of the shadow
    this.blurOpacity = 0.8;
    this.setBlurOpacity = function(r) { this.blurOpacity = r; return this; }
    
    var self = this;
    this.draw = function(ctx) {
        var bounds = this.node.getVisualBounds();
        if(!this.buf1) {
            this.buf1 = new Buffer(
                bounds.getWidth()+this.offsetX+this.blurRadius*4
                ,bounds.getHeight()+this.offsetY+this.blurRadius*4
                );
            this.buf2 = new Buffer(
                bounds.getWidth()+this.offsetX+this.blurRadius*4
                ,bounds.getHeight()+this.offsetY+this.blurRadius*4
                );
        }
        //redraw the child only if it's dirty
        if(this.isDirty()) {
            //render child into first buffer
            this.buf1.clear();
            var ctx1 = this.buf1.getContext();
            ctx1.save();
            ctx1.translate(
                -bounds.getX()+this.blurRadius*2
                ,-bounds.getY()+this.blurRadius*2);
            ctx1.translate(this.offsetX,this.offsetY);
            this.node.draw(ctx1);
            ctx1.restore();

            //apply affect from buf1 into buf2
            this.buf2.clear();
            //buf1->buf2
            this.applyEffect(this.buf1,this.buf2,this.blurRadius);
            
            
            //draw child over blur in buf2
            var ctx2 = this.buf2.getContext();
            ctx2.save();
            ctx2.translate(
                -bounds.getX()+this.blurRadius*2
                ,-bounds.getY()+this.blurRadius*2);
            this.node.draw(ctx2);
            ctx2.restore();
        }
        ctx.save();
        ctx.translate(bounds.getX(),bounds.getY());
        ctx.drawImage(this.buf2.buffer,0,0);
        ctx.restore();
        this.clearDirty();
    };
    
    this.applyEffect = function(buf, buf2, radius) {
        var data = buf.getData();
        var s = radius*2;
        var size = s/2;
        
        for(var x = 0+size; x<buf.getWidth()-size; x++) {
            for(var y = 0+size; y<buf.getHeight()-size; y++) {
                var r = 0;
                var g = 0;
                var b = 0;
                var a = 0;
                for(var ix=x-size; ix<=x+size; ix++) {
                    for(var iy=y-size;iy<=y+size;iy++) {
                        r += buf.getR(data,ix,iy);
                        g += buf.getG(data,ix,iy);
                        b += buf.getB(data,ix,iy);
                        a += buf.getA(data,ix,iy);
                    }
                }
                var divisor = s*s;
                r = r/divisor;
                g = g/divisor;
                b = b/divisor;
                a = a/divisor;
                r = 0x00; g = 0x00; b = 0x00;
                a = a*this.blurOpacity;
                buf2.setRGBA(data,x,y,r,g,b,a);                
            }
        }
        buf2.setData(data);        
    };
    return true;
};
ShadowNode.extend(BlurNode);





/* 
@class Shape The base of all shapes. Shapes are geometric shapes which have a *fill*, a *stroke*, and *opacity*. They may be filled or unfilled.
@category shape
*/
function Shape() {
    Node.call(this);
    this.hasChildren = function() { return false; }
    
    //@property fill The color, gradient, or texture used to fill the shape. May be set to "" or null.
    this.fill = "red";
    this.setFill = function(fill) {
        this.fill = fill;
        this.setDirty();
        return this;
    };
    this.getFill = function() {
        return this.fill;
    };
    
    //@property strokeWidth The width of the shape's outline stroke. Set it to 0 to not draw a stroke.
    this.strokeWidth = 0;
    this.setStrokeWidth = function(sw) {  this.strokeWidth = sw;  this.setDirty();  return this;  };
    this.getStrokeWidth = function() { return this.strokeWidth; };
    
    //@property stroke  The color of the stroke. Will only be drawn if `strokeWidth` is greater than 0.
    this.stroke = "black";
    this.setStroke = function(stroke) { this.stroke = stroke; return this; }
    this.getStroke = function() { return this.stroke; }
    
    return true;
}
Shape.extend(Node);





/* 
@class Text A shape which draws a single line of text with the specified content (a string), font, and color.
@category shape
*/
function Text() {
    Shape.call(this);
    //this.parent = null;
    
    //@property x  The X coordinate of the left edge of the text.
    this.x = 0;
    this.setX = function(x) { this.x = x; this.setDirty(); return this; };
    
    //@property y  The Y coordinate of the bottom edge of the text.
    this.y = 0;
    this.setY = function(y) { this.y = y; this.setDirty(); return this; };
    
    //@property text The actual text string which will be drawn.
    this.text = "-no text-";
    this.setText = function(text) { this.text = text;  this.setDirty();  return this;  };
    
    
    this.draw = function(ctx) {
        if(!this.isVisible()) return;
        var f = ctx.font;
        ctx.font = this.font;
        ctx.fillStyle = this.fill;
        ctx.fillText(this.text,this.x,this.y);
        ctx.font = f;
        this.clearDirty();
    };
    
    //@property font  The font description used to draw the text. Use the CSS font format. ex: *20pt Verdana*
    this.font = "20pt Verdana";
    this.setFont = function(font) { this.font = font; this.setDirty(); return this; }
    
    this.contains = function() { return false; }
    return true;    
};
Text.extend(Shape);

// @class Ellipse  A ellipse shape.
// @category shape
//
function Ellipse() {
    Shape.call(this);

    //@property x  The X coordinate of the *center* of the ellipse (not it's left edge)
    this.x = 0.0;
    this.getX = function() { return this.x; };
    this.setX = function(x) { this.x = x; this.setDirty(); return this; };

    //@property y  The Y coordinate of the *center* of the ellipse (not it's top edge)
    this.y = 0.0;
    this.getY = function() { return this.y; };
    this.setY = function(y) { this.y = y; this.setDirty(); return this; };

    this.width = 20;
    this.getWidth = function() { return this.width; };
    this.setWidth = function(width) { this.width = width; this.setDirty(); return this; };

    this.height = 10;
    this.getHeight = function() { return this.height; };
    this.setHeight = function(height) { this.height = height; this.setDirty(); return this; };

    // @property scaleWidth The width ratio of the ellipse
    this.scaleWidth = 1.0;

    // @property scaleHeight The height ratio of the ellipse
    this.scaleHeight = 1.0;

    // @property radius The radius of the ellipse
    this.radius = (this.width <= this.height) ? this.height : this.width;

    var self = this;

    // @method normalize Computes ratio among width and height and passes the result to ctx.scale(double, double)
    function normalize(width, height) {
      if(width <= height) {
        self.radius = width / 2;
	self.scaleWidth = 1.0;
	self.scaleHeight = height / width;
	self.y /= self.scaleHeight;
      } 
      if(height <= width) {
        self.radius = height / 2;
	self.scaleHeight = 1.0;
        self.scaleWidth = width / height;
	self.x /= self.scaleWidth;
      }
    }

    // @method set Sets the x, y, width and height of the ellipse all in one step
    this.set = function(x, y, width, height) {
        self.x = x;
        self.y = y;
	self.width = width;
	self.height = height;
	self.radius = (self.width <= self.height) ? self.height : self.width;
        self.setDirty();
        return self;
    };

    // Property fill and method setFill are inherited from Node, therefore we need them onlyu for debug.
    //this.fill = "black";
    
    //this.setFill = function(fill) {
        //self.fill = fill;
        //self.setDirty();
        //return self;
    //}

  this.draw = function(ctx) {
        if(!this.isVisible()) return;
        ctx.fillStyle = self.fill;
	normalize(self.width, self.height);
	ctx.scale(self.scaleWidth, self.scaleHeight);
        ctx.beginPath();
        ctx.arc(self.x, self.y, self.radius, 0, Math.PI * 2, false);
        ctx.closePath();
        ctx.fill();
        if(self.getStrokeWidth() > 0) {
            ctx.strokeStyle = self.getStroke();
            ctx.lineWidth = self.getStrokeWidth();
            ctx.stroke();
        }
        this.clearDirty();
    };

    this.contains = function(x,y) {
        if(x >= this.x - this.radius && x <= this.x + this.radius) {
            if(y >= this.y - this.radius && y<= this.y + this.radius) {
                return true;
            }
        }
        return false;
    };

    this.getVisualBounds = function() {
        return new Bounds(this.x - this.width / 2
            ,this.y - this.height / 2
            ,this.width
            ,this.height);
    };
    return true;
};
Ellipse.extend(Shape);







/*
@class Circle  A circle shape.
@category shape
*/
function Circle() {
    Shape.call(this);
    
    //@property x  The X coordinate of the *center* of the circle (not it's left edge).
    this.x = 0.0;
    this.getX = function() { return this.x; };
    this.setX = function(x) { this.x = x; this.setDirty(); return this; };
    
    //@property y  The Y coordinate of the *center* of the circle (not it's top edge).
    this.y = 0.0;
    this.getY = function() { return this.y; };
    this.setY = function(y) { this.y = y; this.setDirty(); return this; };
    
    //@property radius The radius of the circle
    this.radius = 10.0;
    this.getRadius = function() { return this.radius; };
    this.setRadius = function() { this.radius = radius; this.setDirty(); return this; }; 
    var self = this;
    
    //@method Set the x, y, and radius of the circle all in one step
    this.set = function(x,y,radius) {
        self.x = x;
        self.y = y;
        self.radius = radius;
        self.setDirty();
        return self;
    };
    
    //this.fill = "black";
    /*
    this.setFill = function(fill) {
        self.fill = fill;
        self.setDirty();
        return self;
    };*/
    
    this.draw = function(ctx) {
        if(!this.isVisible()) return;
        ctx.fillStyle = self.fill;
        ctx.beginPath();
        ctx.arc(self.x, self.y, self.radius, 0, Math.PI*2, true); 
        ctx.closePath();
        ctx.fill();
        if(self.getStrokeWidth() > 0) {
            ctx.strokeStyle = self.getStroke();
            ctx.lineWidth = self.getStrokeWidth();
            ctx.stroke();
        }
        this.clearDirty();
    };
    this.contains = function(x,y) {
        if(x >= this.x-this.radius && x <= this.x + this.radius) {
            if(y >= this.y-this.radius && y<=this.y + this.radius) {
                return true;
            }
        }
        return false;
    };
    this.getVisualBounds = function() {
        return new Bounds(this.x-this.radius
            ,this.y-this.radius
            ,this.radius*2
            ,this.radius*2);
    };
    return true;
};
Circle.extend(Shape);



/*
@class Rect A rectangular shape. May be rounded or have straight corners.
@category shape
*/
function Rect() {
    Shape.call(this);
    
    //@method Set the x, y, w, h at the same time.
    this.set = function(x,y,w,h) {
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
        this.setDirty();
        return this;
    };
    
    //@property width The width of the rectangle.
    this.width = 100.0;
    this.getWidth = function() { return this.width; };
    this.setWidth = function(w) {
        this.width = w;
        this.setDirty();
        return this;
    };
    
    //@property height The height of the rectangle.
    this.height = 100.0;
    this.getHeight = function() { return this.height; };
    this.setHeight = function(h) {
        this.height = h;
        this.setDirty();
        return this;
    };
    
    //@property x The X coordinate of the rectangle.
    this.x = 0.0;
    this.setX = function(x) {
        this.x = x;
        this.setDirty();
        return this;
    };
    this.getX = function() { return this.x; };
    
    //@property y The Y coordinate of the rectangle.
    this.y = 0.0;
    this.setY = function(y) {
        this.y = y;
        this.setDirty();
        return this;
    };
    this.getY = function() { return this.y; };
    
    
    //@property corner  The radius of the corner, if it's rounded. The radius is the same for all corners. If zero, then the rectangle will not be rounded.
    this.corner = 0;
    this.setCorner = function(c) {
        this.corner = c;
        this.setDirty();
        return this;
    };
    
    this.contains = function(x,y) {
        //console.log("comparing: " + this.x + " " + this.y + " " + this.width + " " + this.height + " --- " + x + " " + y);
        if(x >= this.x && x <= this.x + this.width) {
            if(y >= this.y && y<=this.y + this.height) {
                return true;
            }
        }
        return false;
    };
    this.draw = function(ctx) {
        ctx.fillStyle = this.fill;
        if(this.corner > 0) {
            var x = this.x;
            var y = this.y;
            var w = this.width;
            var h = this.height;
            var r = this.corner;
            ctx.beginPath();
            ctx.moveTo(x+r,y);
            ctx.lineTo(x+w-r, y);
            ctx.bezierCurveTo(x+w-r/2,y,   x+w,y+r/2,   x+w,y+r);
            ctx.lineTo(x+w,y+h-r);
            ctx.bezierCurveTo(x+w,y+h-r/2, x+w-r/2,y+h, x+w-r, y+h);
            ctx.lineTo(x+r,y+h);
            ctx.bezierCurveTo(x+r/2,y+h,   x,y+h-r/2,   x,y+h-r);
            ctx.lineTo(x,y+r);
            ctx.bezierCurveTo(x,y+r/2,     x+r/2,y,     x+r,y);
            ctx.closePath();
            ctx.fill();
            if(this.strokeWidth > 0) {
                ctx.strokeStyle = this.getStroke();
                ctx.lineWidth = this.strokeWidth;
                ctx.stroke();
            }
        } else {
            ctx.fillRect(this.x,this.y,this.width,this.height);
            if(this.strokeWidth > 0) {
                ctx.strokeStyle = this.getStroke();
                ctx.lineWidth = this.strokeWidth;
                ctx.strokeRect(this.x,this.y,this.width,this.height);
            }
        }
        this.clearDirty();
    };
    this.getVisualBounds = function() {
        return new Bounds(this.x,this.y,this.width,this.height);
    };
    return true;
};
Rect.extend(Shape);



var SEGMENT_MOVETO = 1;
var SEGMENT_LINETO = 2;
var SEGMENT_CLOSETO = 3;
var SEGMENT_CURVETO = 4;
function Segment(kind,x,y,a,b,c,d) {
    this.kind = kind;
    this.x = x;
    this.y = y;
    if(kind == SEGMENT_CURVETO) {
        this.cx1 = x;
        this.cy1 = y;
        this.cx2 = a;
        this.cy2 = b;
        this.x = c;
        this.y = d;
    }
};

/*
@class Path A Path is a sequence of line and curve segments. It is used for drawing arbitrary shapes and animating.  Path objects are immutable. You should create them and then reuse them.
@category resource
*/
function Path() {
    this.segments = [];
    this.closed = false;
    
    //@doc jump directly to the x and y. This is usually the first thing in your path.
    this.moveTo = function(x,y) { this.segments.push(new Segment(SEGMENT_MOVETO,x,y)); return this; };
    
    //@doc draw a line from the previous x and y to the new x and y.
    this.lineTo = function(x,y) { this.segments.push(new Segment(SEGMENT_LINETO,x,y)); return this; };
    
    //@doc close the path. It will draw a line from the last x,y to the first x,y if needed.
    this.closeTo = function(x,y) {
        this.segments.push(new Segment(SEGMENT_CLOSETO,x,y)); 
        this.closed = true;
        return this;
    };
    
    //@doc draw a beizer curve from the previous x,y to a new point (x2,y2) using the four control points (cx1,cy1,cx2,cy2).
    this.curveTo = function(cx1,cy1,cx2,cy2,x2,y2) {
        this.segments.push(new Segment(SEGMENT_CURVETO,cx1,cy1,cx2,cy2,x2,y2));
        return this;
    };
    
    //@doc build the final path object.
    this.build = function() {
        return this;
    };
    
    this.pointAtT = function(fract) {
        if(fract >= 1.0 || fract < 0) return [0,0];

        var segIndex = 0;
        segIndex = Math.floor(fract*(this.segments.length-1));
        var segFract = (fract*(this.segments.length-1))-segIndex;
        //console.log("seg index = " + (segIndex+1) + " f=" + fract + " sgf=" + segFract);// + " type=" + this.segments[segIndex+1].kind);
        var seg = this.segments[segIndex+1];
        var prev;
        var cur;
        switch (seg.kind) {
            case SEGMENT_MOVETO: return [0,0];
            case SEGMENT_LINETO:
                prev = this.segments[segIndex];
                cur = seg;
                return this.interpLinear(prev.x,prev.y,cur.x,cur.y,segFract);
            case SEGMENT_CURVETO:
                prev = this.segments[segIndex];
                cur = seg;
                return this.interpCurve(prev.x,prev.y,cur.cx1,cur.cy1,cur.cx2,cur.cy2, cur.x, cur.y,segFract);
            case SEGMENT_CLOSETO:
                prev = this.segments[segIndex];
                cur = this.segments[0];
                return this.interpLinear(prev.x,prev.y,cur.x,cur.y,segFract);
        }
        return [10,10];
    };

    this.interpLinear = function(x1, y1, x2, y2, fract) {
        return [ (x2-x1)*fract + x1, (y2-y1)*fract + y1 ];
    }
    
    this.interpCurve = function( x1, y1, cx1, cy1, cx2, cy2, x2, y2, fract) {
        return getBezier(fract, [x2,y2], [cx2,cy2], [cx1,cy1], [x1,y1] );
    }
    
    return true;
};

function B1(t) { return t*t*t; }
function B2(t) { return 3*t*t*(1-t); }
function B3(t) { return 3*t*(1-t)*(1-t); }
function B4(t) { return (1-t)*(1-t)*(1-t); }
function getBezier(percent, C1, C2, C3, C4) {
    var pos = [];
    pos[0] = C1[0]*B1(percent) + C2[0]*B2(percent) + C3[0]*B3(percent) + C4[0]*B4(percent);
    pos[1] = C1[1]*B1(percent) + C2[1]*B2(percent) + C3[1]*B3(percent) + C4[1]*B4(percent);
    return pos;
}


/*
@class PathNode  Draws a path.
@category shape
*/
function PathNode() {
    Shape.call(this);
    //@property path  the Path to draw
    this.path = null;
    this.setPath = function(path) {
        this.path = path;
        this.setDirty();
        return this;
    };
    this.getPath = function() {
        return this.path;
    };
    
    this.draw = function(ctx) {
        if(!this.isVisible()) return;
        ctx.fillStyle = this.fill;
        ctx.beginPath();
        for(var i=0; i<this.path.segments.length; i++) {
            var s = this.path.segments[i];
            if(s.kind == SEGMENT_MOVETO) 
                ctx.moveTo(s.x,s.y);
            if(s.kind == SEGMENT_LINETO) 
                ctx.lineTo(s.x,s.y);
            if(s.kind == SEGMENT_CURVETO)
                ctx.bezierCurveTo(s.cx1,s.cy1,s.cx2,s.cy2,s.x,s.y);
            if(s.kind == SEGMENT_CLOSETO)
                ctx.closePath();
        }
        if(this.path.closed) {
            ctx.fill();
        }
        if(this.strokeWidth > 0) {
            ctx.strokeStyle = this.stroke;
            ctx.lineWidth = this.strokeWidth;
            ctx.stroke();
            ctx.lineWidth = 1;
        }
        this.clearDirty();
    };
    return true;
};
PathNode.extend(Shape);




