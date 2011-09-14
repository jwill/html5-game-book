function BinaryClock() {
    if ( !(this instanceof arguments.callee) ) {
        return new arguments.callee(arguments); 
    }
    
    var self = this;
    
    self.init = function () {
        self.currentTime = new Date();
        self.group = new Group();
        self.drawLines();
        
        
        
        var can = document.getElementById("gameboard");
        var runner = new Runner().setCanvas(can);
        runner.root = self.group;
        runner.addCallback(self.setTime);
        runner.start();
    };
    
    self.drawLines = function () {
        self.lines = [];
        for (var i=0; i<6; i++) {
            var line = new ClockLine()
            self.lines.push(line);
        }
        
        self.lines[0].setMaxValue(4);
        self.lines[1].setMaxValue(8);
        
        self.lines[2].setMaxValue(4);
        self.lines[3].setMaxValue(8);
        
        self.lines[4].setMaxValue(4);
        self.lines[5].setMaxValue(8);
        
        // Alignment
        self.lines[0].components.setY(60);
        self.lines[2].components.setY(60); 
        self.lines[4].components.setY(60);
        
        for (i=0; i<6; i++) {
            var line = self.lines[i];
            line.drawSquares();
            line.setX(i*(50+10));
            self.group.add(self.lines[i].components);
        }
    }
    
    self.setTime = function () {
        var time = new Date();
        var hrs, mins, secs;
        var h1,h2,m1,m2,s1
        hrs = time.getHours();
        // handle 12 hr vs 24 hr
        //
        mins = time.getMinutes();
        secs = time.getSeconds();
        
        hrs = hrs.toString().lpad("0",2);
        mins = mins.toString().lpad("0",2);
        secs = secs.toString().lpad("0",2);
        
        self.lines[0].setValue(hrs[0]);
        self.lines[1].setValue(hrs[1]);
        
        self.lines[2].setValue(mins[0]);
        self.lines[3].setValue(mins[1]);
        
        self.lines[4].setValue(secs[0]);
        self.lines[5].setValue(secs[1]);

        // change the lines
       // console.log(new Date());
    };
    
    self.init();
}

function ClockLine() {
    if ( !(this instanceof arguments.callee) ) {
        return new arguments.callee(arguments); 
    }
    
    var self = this;
    
    self.init = function() {
        self.maxValue = 8; // default
        self.sideLength = 50;
        self.components = new Group();
    };
    
    self.createNewRect = function() {
        return new Rect().set(0, 0, self.sideLength, self.sideLength);
    };
    
    self.drawSquares = function () {
        var rect = [];
        for(var i=0; i<4; i++) {
            rect.push(self.createNewRect());
        }
        for(var j=0; j<4; j++) {
            rect[j].setY(j*(self.sideLength+10));
        }
        if (self.maxValue == 8) {
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
        var temp = Number(val);     // convert string to number
        self.value = temp;
        var binaryText = temp.toString(2);
        if (self.maxValue == 8) {
            binaryText = binaryText.lpad("0", 4);
        } else if (self.maxValue == 4) {
            binaryText = binaryText.lpad("0", 3);
        } else {
            binaryText = binaryText.lpad("0", 2);
        }
        var count = 0;
        for (var i=0; i<binaryText.length; i++) {
            var v = binaryText[i];
            if (v == "0") {
                self.components.getChild(i).setFill("red");
            } else {
                self.components.getChild(i).setFill("green");
                count++;
            }
        }
        if (count == 4) {
            console.log(new Date());
        }
    };
    
    self.setX = function (x) {
        for (var i=0; i<self.components.childCount(); i++) {
            self.components.getChild(i).setX(x);
        }
    };
    
    self.init();
}

// Source: http://sajjadhossain.com/2008/10/31/javascript-string-trimming-and-padding/
String.prototype.lpad = function(padString, length) {
    var str = this;
    while (str.length < length)
        str = padString + str;
    return str;
}