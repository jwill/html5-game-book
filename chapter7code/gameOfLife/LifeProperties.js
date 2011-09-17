/**
 *
 *Ported to JavaScript From:
  Pro Java 6 3D Game Development
  Andrew Davison
  Apress, April 2007
  ISBN: 1590598172 
  http://www.apress.com/book/bookDisplay.html?bID=10256
  Web Site for the book: http://fivedots.coe.psu.ac.th/~ad/jg2

 */
var LifeProperties = Class.create({
		initialize: function(json) {
			this.life3DProps = json;
			this.PWIDTH = 512;
			this.PHEIGHT = 512;
			this.NUM_NEIGHBORS = 26;
			this.MIN_LEN = 50;
			
			this.BIRTH_RANGE = { 5:true};
			this.DIE_RANGE = {3:true, 4:true, 5:true, 6:true};
		},
		getSpeed: function() {
			prop = this.life3DProps["speed"];
			if (prop != null) {
				if (prop.equals("slow"))
					return Props.SPEED.SLOW;
				else if (prop.equals("medium"))
					return Props.SPEED.MEDIUM;
				else if (prop.equals("fast"))
					return Props.SPEED.FAST;
				else {
					console.log("speed value "+prop+" incorrect; using fast");
					return Props.SPEED.FAST;
				}
			} else {
				console.log("No speed property found; using fast");
				return Props.SPEED.FAST;
			}
		},
		setSpeed: function(speed) {
			switch (speed) { 
				case Props.SPEED.SLOW: 
					life3DProps["speed"] = "slow";
					break;
				case Props.SPEED.MEDIUM: 
					life3DProps["speed"] = "medium";
					break;
				case Props.SPEED.FAST: 
					life3DProps["speed"] = "fast";
					break;
				default: 
					console.log("Did not understand speed setting, using fast");
          life3DProps["speed"] = "fast";
          break;
      }
		},
		getWidth: function() {
			prop = life3DProps["width"];
			if (prop != null) {
				return checkWidth(prop);
			} else {
				console.log("No width property found; using " + this.PWIDTH);
					return this.PWIDTH;
			}
		},
		getHeight: function() {
			prop = life3DProps["height"];
			if (prop != null) {
				return checkHeight(prop);
			} else {
				console.log("No height property found; using " + this.PHEIGHT);
					return this.PHEIGHT;
			}
		},
		checkWidth: function(w) {
			width = parseInt(w);
			if (isNaN(width) == false) {
				if (width < this.MIN_LEN) {
					console.log("width too small; set to "+ this.MIN_LEN);
					return this.MIN_LEN;
				} else if (width > window.innerWidth) {
					console.log("width too large; set to " + window.innerWidth);
					return window.innerWidth;
				}
			}
			return width;
		},
		checkHeight: function(h) {
			height = parseInt(h);
			if (isNaN(height) == false) {
				if (height < this.MIN_LEN) {
					console.log("height too small; set to "+ this.MIN_LEN);
					return this.MIN_LEN;
				} else if (width > window.innerHeight) {
					console.log("height too large; set to " + window.innerHeight);
					return window.innerHeight;
				}
			}
			return height;
		},
		setWidth: function(w) {
			width = checkWidth(w);
			this.life3DProps["width"] = width;
		},
		setHeight: function(h) {
			height = checkWidth(h);
			this.life3DProps["height"] = height;
		},
		getBirth: function() {
			if (this.life3DProps["birth"] != null)
				return this.life3DProps["birth"];
			else {
				console.log("No birth property found; using "+this.BIRTH_RANGE);
				return this.BIRTH_RANGE;
			}
		},
		getDie: function() {
			if (this.life3DProps["die"] != null)
				return this.life3DProps["die"];
			else {
				console.log("No die property found; using "+this.DIE_RANGE);
				return this.DIE_RANGE;
			}
		}
});
 
