/**
 * @author jwill
 */
function Parallax() {
	if ( !(this instanceof arguments.callee) ) {
        return new arguments.callee(arguments); 
    }
	
	var self = this;
	
	self.init = function() {
		self.setupTimeline();
		self.context = document.getElementById("c").getContext("2d");
	}
	
	self.setupTimeline = function() {
		self.parallaxTimeline = new Timeline(this);

  		self.parallaxTimeline.duration = 5000;
		self.parallaxTimeline.addEventListener("onpulse", function (timeline, durationFraction, timelinePosition) {
			var ctx = self.context;
			ctx.clearRect(0, 0, 320, 200);
			// background layer is stationary
			ctx.drawImage(document.images[0], 0, 0);
		
			self.drawLayer(timelinePosition, document.images[1]);
			self.drawLayer(timelinePosition, document.images[2]);
			self.drawLayer(timelinePosition, document.images[3]);		
		});
		self.parallaxTimeline.playInfiniteLoop(RepeatBehavior.LOOP);
	}
	
	self.drawLayer = function(position, image) {
		var ctx = self.context;

		var startX = position*image.width;
		
		var pixelsLeft = image.width - startX;
		var pixelsToDraw;
		
		ctx.drawImage(image, startX, 0, pixelsLeft, 200, 0, 0, pixelsLeft, 200);
		if(pixelsLeft < 320) {
			pixelsToDraw = image.width - pixelsLeft;
			ctx.drawImage(image, 0, 0, pixelsToDraw, 200, pixelsLeft-1, 0, pixelsToDraw, 200);
		}
		
	}
	
	self.suspend = function() {
		self.parallaxTimeline.suspend();
	}
	
	self.init();
}
