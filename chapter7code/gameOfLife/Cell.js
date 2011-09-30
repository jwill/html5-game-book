/**
 *
 *Non Three.js Logic ported to JavaScript From:
  Pro Java 6 3D Game Development
  Andrew Davison
  Apress, April 2007
  ISBN: 1590598172 
  http://www.apress.com/book/bookDisplay.html?bID=10256
  Web Site for the book: http://fivedots.coe.psu.ac.th/~ad/jg2

 */
sphereGeometry = new THREE.Sphere(Props.CELL_LEN,16,16);
var Cell = Class.create({
		initialize: function(x,y,z) {
			this.age = 0;
			this.alive = (Math.random() < 0.1) ? true : false;
			this.makeMaterial();
			this.mesh = new THREE.Mesh(
					window.suzanne, this.material
			);
						
			this.mesh.position.x = x * Props.CELL_LEN * Props.CELL_SPACING;
			this.mesh.position.y = y * Props.CELL_LEN * Props.CELL_SPACING;
			this.mesh.position.z = z * Props.CELL_LEN * Props.CELL_SPACING;
			this.visualState = Props.STATES.INVISIBLE;
			this.setVisibility();
			scene.addObject(this.mesh);
		
		},
		reset: function() {
			this.age = 0;
			this.alive = (Math.random() < 0.5) ? true : false;
			this.makeMaterial();
		},
		makeMaterial: function() {
			this.cellColor = 0xFFFFFF;
			this.oldColor = 0xFFFFFF;
			this.newColor = 0xFFFFFF;
			
			this.material = new THREE.MeshPhongMaterial({
					color:Props.COLORS.white,
					ambient:Props.COLORS.white,
					specular:Props.COLORS.white,
					shininess:100.0,
					opacity:0.0
			});
		},
		resetColors:function() {
			this.cellColor = Props.COLORS.blue;
			this.oldColor = this.cellColor;
			this.newColor = this.cellColor;
			this.setMaterialColors(this.cellColor);
		},
		setMaterialColors:function(hexColor) {
			// ambient color is darker shade of the diffuse color

			var rgb = hexToRGB(hexColor);
			this.material.color = rgb;
			this.material.ambient = {r:rgb.r/3.0, g:rgb.g/3.0, b:rgb.b/3.0};
		},
		setVisibility: function() {
			if (this.alive) {
				this.visualState = Props.STATES.VISIBLE;
				this.material.opacity = 1.0;
			} else {
				this.visualState = Props.STATES.INVISIBLE;
				this.material.opacity = 0.0;
				//this.age = 0;
			}
		},
		
		isAlive: function() {
			return this.alive;
		},
		newAliveState: function(b) {
			this.newAlive = b;
		},
		updateState: function() {
			if (this.alive != this.newAlive) {
				if (this.alive && !this.newAlive) {
					this.visualState = Props.STATES.FADE_OUT;
					this.age = 0;
				} else {
					this.visualState = Props.STATES.FADE_IN;
					this.age = 0;
					this.resetColors();
				}
			} else {
				if (this.alive) {
					this.age++;
					this.ageSetColor();
				}
			}
		},
		ageSetColor: function() {
			if (this.age > 40)
				this.setMaterialColors(Props.COLORS.red)
			else if (this.age > 20)
				this.setMaterialColors(Props.COLORS.orange)
			else if (this.age > 2)
				this.setMaterialColors(Props.COLORS.green)
			else this.setMaterialColors(Props.COLORS.blue)
		},
		visualChange:function(counter) {
			var transFrac = counter/Props.MAX_TRANS;
			
			if (this.visualState == Props.STATES.FADE_OUT)
				this.material.opacity = 1.0 - transFrac;
			else if (this.visualState == Props.STATES.FADE_IN)
				this.material.opacity = transFrac;
			else if (this.visualState == Props.STATES.VISIBLE) {
				this.interpolateColor(transFrac);
			} else if (this.visualState == Props.STATES.INVISIBLE) {
			}
			else console.log("Error in visualState.");
			
			if (counter == Props.MAX_TRANS)
				this.endVisualTransition();
		},
		interpolateColor:function(transFrac) {
			if(this.oldColor != this.newColor) {
				oldRGB = hexToRGB(this.oldColor);
				newRGB = hexToRGB(this.newColor);
				
				redFrac = oldRGB.R*(1.0-transFrac) + newRGB.R*transFrac;
				greenFrac = oldRGB.G*(1.0-transFrac) + newRGB.G*transFrac;
				blueFrac = oldRGB.B*(1.0-transFrac) + newRGB.B*transFrac;
				
				transformedColor = rgbToHex(redFrac,greenFrac,blueFrac)
				this.setMaterialColors(transformedColor);
			}
		},
		endVisualTransition: function() {
			this.oldColor = this.cellColor;
			this.newColor = this.cellColor;
			
			this.alive = this.newAlive;
		//	this.newAliveState = null;
			
			if (this.visualState == Props.STATES.FADE_IN)
				this.visualState = Props.STATES.VISIBLE;
			else if (this.visualState == Props.STATES.FADE_OUT)
				this.visualState = Props.STATES.INVISIBLE;
		}
});

function hexToRGB(hex) {
	h = hex.toString(16);
	h = String("000000"+h).slice(-6);
	function findComponent(start, end) {
		return parseInt(h.substring(start,end), 16)/255.0;
	}
	R = findComponent(0,2);
	G = findComponent(2,4);
	B = findComponent(4,6);
	
	return {r:R, g:G, b:B};
}

function rgbToHex(r,g,b) {
	function toHex(value) {
		if (value == 0) 
			return "00";
		temp = value * 255.0;
		n = Math.round(temp);
		return "0123456789ABCDEF".charAt((n-n%16)/16) +
			"0123456789ABCDEF".charAt(n%16);
	}
	return toHex(r)+toHex(g)+toHex(b);
}
