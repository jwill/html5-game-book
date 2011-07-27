/**
 * @author jwill
 */

function Sprites() {
	if ( !(this instanceof arguments.callee) ) {
        return new arguments.callee(arguments); 
    }
	
	var self = this;
	
	self.init = function() {
		self.current = 0;
		self.context = document.getElementById("c").getContext("2d");
		self.sheet = document.images[0];
		self.spriteTimeline = new Timeline(this);
		self.spriteTimeline.addPropertiesToInterpolate([
			{ property: "current", from:0, to: 36,
	  		  interpolator: new IntPropertyInterpolator()}
  		]);

  		self.spriteTimeline.duration = 5000;
		self.spriteTimeline.addEventListener("onpulse", function (timeline, durationFraction, timelinePosition) {
			self.drawSprite();			
		});

		self.spriteTimeline.play();
	}
	
	self.play = function() {
		self.spriteTimeline.play();
	}

	self.drawSprite = function() {
		var ctx = self.context;
		var row = 0;
		ctx.clearRect(0, 0, 128, 128);
		ctx.drawImage(self.sheet, self.current *128, row*128, 128, 128, 0, 0, 128, 128);

	}
		
	self.init();
}
