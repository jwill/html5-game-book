/**
 * Game and logic for Copy Me Game
 * @author jwill
 */

function Game() {
	if ( !(this instanceof arguments.callee) ) {
        return new arguments.callee(arguments); 
    }
	
	var self = this;
	self.gameLoop = null;
	
	self.init = function() {
		self.canvas = document.getElementById("game");
		self.context = self.canvas.getContext("2d");
		self.sequence = null;
		self.position = 0;
		self.currentRound = 1;
		self.playersTurn = false;
		self.playerSequence = new Array();
		self.generateSequence(3);
		
		self.setupTimelines();
		self.setupAudioChannels();
				
		self.canvas.addEventListener("click", self.handleMouseClick, false);
		
		self.startGame();
	}
	
	self.setupTimelines = function() {
		// colors to interpolate
		self.redColor = "rgb(200,0,0)";
		self.greenColor = "rgb(0,150,0)";
		self.blueColor = "rgb(0,0,150)";
		self.yellowColor = "rgb(150,150,0)";
		
		
		self.timelines = new Object();
		//red
		var redTimeline = new Timeline(this);
		redTimeline.addPropertiesToInterpolate([
			{ property: "redColor", 
			goingThrough:{0:"rgb(200,0,0)", 0.5: "rgb(255,0,0)", 1:"rgb(200,0,0)"},
	  		  interpolator: new RGBPropertyInterpolator()}
  		]);

		//green
		var greenTimeline = new Timeline(this);
		greenTimeline.addPropertiesToInterpolate([
			{ property: "greenColor", goingThrough:{0:"rgb(0,150,0)", 0.5: "rgb(0,255,0)", 1:"rgb(0,150,0)"},
	  		  interpolator: new RGBPropertyInterpolator()}
  		]);
		//blue
		var blueTimeline = new Timeline(this);
		blueTimeline.addPropertiesToInterpolate([
			{ property: "blueColor", goingThrough:{0:"rgb(0,0,150)", 0.5:"rgb(0,0,255)", 1:"rgb(0,0,150)"},
	  		  interpolator: new RGBPropertyInterpolator()}
  		]);
		//yellow
		var yellowTimeline = new Timeline(this);
		yellowTimeline.addPropertiesToInterpolate([
			{ property: "yellowColor", goingThrough:{0:"rgb(150,150,0)", 0.5:"rgb(255,255,0)", 1:"rgb(150,150,0)"},
	  		  interpolator: new RGBPropertyInterpolator()}
  		]);
		
		redTimeline.duration = greenTimeline.duration = blueTimeline.duration = yellowTimeline.duration =500;
		
		self.timelines.red = redTimeline;
		self.timelines.blue = blueTimeline;
		self.timelines.green = greenTimeline;
		self.timelines.yellow = yellowTimeline;
	}
	
	self.setupAudioChannels = function() {
		self.numChannels = 1;
		self.channels = new Array();
		for (var i = 0; i<self.numChannels; i++) {
			self.channels[i] = new Audio();
		}
		
		self.sounds = new Object();
		self.sounds.red    = "sounds/A2h.mp3";
		self.sounds.green  = "sounds/A3h.mp3";
		self.sounds.blue   = "sounds/D3h.mp3";
		self.sounds.yellow = "sounds/G3h.mp3";
	}
	
	self.startGame = function() {
		self.gameLoop = new Timeline(this);
		self.gameLoop.addEventListener("onpulse", function (t, d, tp) {
			// check if it is the computers turn
			// play sequence - play sounds
			// wait for player to play sequence
            // forces a 1 second gap between rounds
			if (!self.playersTurn) {
				self.playersTurn = true;
				setTimeout(function(){self.playSequence();},1000);
			} 
			self.drawSquares();	
		});
		self.gameLoop.playInfiniteLoop();
	}
	
	self.generateSequence = function(numTones) {
		if (self.sequence == null)
			self.sequence = new Array();
		for (var i=0; i<numTones; i++)
			self.sequence.push(Math.floor(Math.random() * 100) % 4);
	}
	
	self.playSequence = function() {
		self.currentPosition = 1;
		self.audios = new Array();
		for (var i = 0; i < self.sequence.length; i++) {
			var position = self.sequence[i];
			// red, green blue, yellow
			switch (position) {
				case 0:
					self.audios.push({
						audio: new Audio(self.sounds.red),
						timeline: self.timelines.red
					});
					break;
				case 1:
					self.audios.push({
						audio: new Audio(self.sounds.green),
						timeline: self.timelines.green
					});
					break;
				case 2:
					self.audios.push({
						audio: new Audio(self.sounds.blue), 
						timeline:self.timelines.blue
					});
					break;
				case 3:
					self.audios.push({
						audio: new Audio(self.sounds.yellow),
						timeline: self.timelines.yellow
					});
					break;
			}
			if (i < self.sequence.length - 1) {
				self.audios[i].audio.addEventListener('ended', self.playNext, false);
			}
			
		}
		self.audios[0].audio.play();
		self.audios[0].timeline.play();
	}
	
	self.playNext = function() {
		var j = self.currentPosition++;
		self.audios[j].audio.play();
		self.audios[j].timeline.play();
		
	}
	
	self.drawGameText = function() {
		var ctx = self.context;
		ctx.font="36px ReenieBeanie, serif";
		ctx.fillText("Copy Me", 250,250);
		ctx.fillText("Round " + self.currentRound, 250,300);
	}
	
	self.drawSquares = function() {
		var ctx = self.context;
		
		ctx.clearRect(0,0,600,600);
		self.drawGameText();
		ctx.shadowColor = "gray";
		
		ctx.save();
		ctx.fillStyle = self.redColor;
		ctx.shadowOffsetX = 5;
		ctx.shadowOffsetY = 10;	
		ctx.beginPath();
		ctx.rect(200,0, 200,200);
		ctx.fill();
		ctx.restore();
		
		ctx.save();
		ctx.fillStyle = self.blueColor;
		ctx.shadowOffsetX = 5;
		ctx.shadowOffsetY = 10;	
		ctx.beginPath();
		ctx.rect(0,200, 200,200);
		ctx.fill();
		ctx.restore();
		
		ctx.save();
		ctx.fillStyle = self.yellowColor;
		ctx.shadowOffsetX = 5;
		ctx.shadowOffsetY = 10;	
		ctx.beginPath();
		ctx.rect(400,200, 200,200);
		ctx.fill();
		ctx.restore();
		
		ctx.save();
		ctx.fillStyle = self.greenColor;
		ctx.shadowOffsetX = 5;
		ctx.shadowOffsetY = 10;	
		ctx.beginPath();
		ctx.rect(200,400, 200,200);
		ctx.fill();
		ctx.restore();
	}
	
	self.handleMouseClick = function(evt) {
		x = evt.clientX - self.canvas.offsetLeft;
		y = evt.clientY - self.canvas.offsetTop;
		console.log("x,y:"+x+","+y);
		
		var audio;
		var value;
		// has to be red or blue
		if (x >= 200 && x <= 400) {
			if (y >= 0 && y <= 200) {
				//is red
				//register red click
				audio = new Audio(self.sounds.red);
				audio.play();
				self.timelines.red.play();
				value = 0;
			} else if(y >= 400 && y <= 600) {
				//is blue
				//register blue click
				//start timeline
				audio = new Audio(self.sounds.green);
				audio.play();
				self.timelines.green.play();
				value = 1;
			}
		} else if (y >= 200 && y <= 400) {
			if (x >= 0 && x <= 200) {
				//green
				audio = new Audio(self.sounds.blue);
				audio.play();
				self.timelines.blue.play();
				value = 2;
			} else if(x >= 400 && x <= 600) {
				//yellow
				audio = new Audio(self.sounds.yellow);
				audio.play();
				self.timelines.yellow.play();
				value = 3;
			}
			
		}
		console.log("value:"+value);
		if (value != undefined) {
			self.playerSequence.push(value);
		
			if (self.playerSequence[self.position] != self.sequence[self.position]) {
				// blink all timelines
				self.timelines.red.play();
				self.timelines.green.play();
				self.timelines.blue.play();
				self.timelines.yellow.play();
				self.currentRound = 1;
				self.position = 0;
				self.playerSequence = new Array();
				self.sequence = self.generateSequence(3);
				self.playersTurn = false;
			} else {
				if (self.playerSequence.length == self.sequence.length) {
					//increment round
					self.currentRound++;
					// computers turn
					self.playerSequence = new Array();
					self.position = 0;
					self.generateSequence(1);
					self.playersTurn = false;
				} else self.position++;
			}
			console.log(self.sequence);
			console.log(self.playerSequence);
		}
		
		
	}
	
	self.init();
}
