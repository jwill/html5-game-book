function Clock() {
    if ( !(this instanceof arguments.callee) ) {
        return new arguments.callee(arguments); 
    }
    
    var self = this;
    
    self.init = function () {
        self.currentTime = new Date()
        self.d = new ClockLine()
        self.d.drawSquares();
        var can = document.getElementById("gameboard");
        var runner = new Runner().setCanvas(can);
        runner.root =self.d.components;
        runner.start();
    }
    
    self.setTime = function () {
        var time = new Date();
        var hrs, mins, secs;
        hrs = time.getHours();
        mins = time.getMinutes();
        secs = time.getSeconds();
        
        // change the lines
        
    }
    self.init();
}

function ClockLine() {
    if ( !(this instanceof arguments.callee) ) {
        return new arguments.callee(arguments); 
    }
    
    var self = this;
    
    self.init = function() {
        self.maxValue = 9; // default
        self.sideLength = 50;
        self.components = new Group();
    };
    
    self.createNewRect = function() {
        return new Rect().set(0, 0, self.sideLength, self.sideLength);
    }
    
    self.drawSquares = function () {
        var rect = [];
        for(var i=0; i<4; i++) {
            rect.push(self.createNewRect());
        }
        for(var j=0; j<4; j++) {
            rect[j].setY(j*(self.sideLength+10));
        }
        if (self.maxValue == 9) {
            self.components.add(rect[0]).add(rect[1]).add(rect[2]).add(rect[3]);
        } else if (self.maxValue == 4) {
            self.components.add(rect[0]).add(rect[1]).add(rect[2]);
        } else {
            self.components.add(rect[0]).add(rect[1]);
        }
        
    };
    
    self.setMaxValue = function(val) {
        self.maxValue = val;
    };
    
    self.setValue = function(val) {
        var binaryText = val.toString(2);
        if (self.maxValue == 9) {
            binaryText = binaryText.lpad("0", 4);
        } else if (self.maxValue == 4) {
            binaryText = binaryText.lpad("0", 3);
        } else {
            binaryText = binaryText.lpad("0", 2);
        }
        for (var i=0; i<binaryText.length; i++) {
            var v = binaryText[i];
            if (v == "0") {
                self.components.getChild(i).setFill("red");
            } else self.components.getChild(i).setFill("green");
        }
    }
    
    self.init();
}

// Source: http://sajjadhossain.com/2008/10/31/javascript-string-trimming-and-padding/
String.prototype.lpad = function(padString, length) {
    var str = this;
    while (str.length < length)
        str = padString + str;
    return str;
}