/**
 * @author jwill
 */
function Game() {
	if ( !(this instanceof arguments.callee) ) {
        return new arguments.callee(arguments); 
    }
	
	var spritesArray;
	
	var self = this;
	
	self.init = function() {
		self.spritesArray = new Array();
		for (var i = 0; i<3; i++) {
			var tempArray = new Array();
			for (var j = 0; j<3; j++) {
				tempArray.push("");
			}
			self.spritesArray.push(tempArray);
		}
		self.isXsTurn = true;
		self.canvas = document.getElementById("board");
		self.canvas.addEventListener("click", self.handleMouseClick, false);

		self.context = self.canvas.getContext("2d");
		self.drawGameBoard();
	}
	
	self.drawXSprite = function (x, y) {
		var ctx = self.context;
		
		// Save the canvas state and translate
		ctx.save();
		ctx.translate(x,y);
		
		ctx.lineWidth = 2;
		ctx.beginPath();
		
		ctx.moveTo(10,10);
		ctx.lineTo(190,190);
		ctx.moveTo(190,10);
		ctx.lineTo(10,190);
		ctx.stroke();
		
		// Restore canvas state
		ctx.restore();
		
	}
	
	self.drawOSprite = function(x, y) {
		var ctx = self.context;
		
		// Save the canvas state and translate
		ctx.save();
		ctx.translate(x,y);
		
		ctx.lineWidth = 2;
		ctx.beginPath();
		
		ctx.arc(100,100, 90, 0, 2*Math.PI);
		ctx.stroke();

		// Restore canvas state
		ctx.restore();
	}
	
	self.drawGameBoard = function() {
		var ctx = self.context;

		ctx.beginPath();
		ctx.moveTo(200,0);
		ctx.lineTo(200,600);
		
		ctx.moveTo(400,0);
		ctx.lineTo(400,600);
		
		ctx.moveTo(0,200);
		ctx.lineTo(600,200);
		
		ctx.moveTo(0,400);
		ctx.lineTo(600,400);
		
		ctx.stroke();
		//More concise means of drawing the lines using rectangles
		//ctx.rect(200, 0, 1, 600);
		//ctx.rect(400, 0, 1, 600);
		//ctx.rect(0, 200, 600, 1);
		//ctx.rect(0, 400, 600, 1);
		//ctx.fill();
	}
	
	self.handleMouseClick = function(evt) {
		x = evt.clientX - self.canvas.offsetLeft;
		y = evt.clientY - self.canvas.offsetTop;
		
		console.log("x,y:"+x+","+y);
	}
	
	self.init();
}


