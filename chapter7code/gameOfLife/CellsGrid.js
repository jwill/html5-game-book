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

var CellsGrid = Class.create({
	initialize:function(lifeProperties) {
		this.lifeProps = lifeProperties;
		
		// load birth and die ranges
		this.birthRange = this.lifeProps.getBirth();
		this.dieRange = this.lifeProps.getDie();
		
		this.turnAngle = 0.0;
		this.turnAxis = 0;
		
		this.transCounter = 0;
		
		this.setTurnAngle();
		
		// initialize the grid
		this.cells = new Array(Props.GRID_LEN);
		for (var i=0; i<Props.GRID_LEN; i++) {
			this.cells[i] = new Array(Props.GRID_LEN);
			for (var j=0; j<Props.GRID_LEN; j++) {
				this.cells[i][j] = new Array(Props.GRID_LEN);
				for (var k=0; k<Props.GRID_LEN; k++) {
					this.cells[i][j][k] = new Cell(i-Props.GRID_LEN/2, j-Props.GRID_LEN/2, k-Props.GRID_LEN/2);
				}
			}
		}
	}, 
	setTurnAngle: function() {
		var speed = this.lifeProps.getSpeed();
		if (speed = Props.SPEED.SLOW)
			this.turnAngle = Props.ROTATE_AMT/4;
		else if (speed = Props.SPEED.MEDIUM)
			this.turnAngle = Props.ROTATE_AMT/2;
		else this.turnAngle = Props.ROTATE_AMT;
	},
	update: function() {
		
		if (this.transCounter == 0) {
			this.stateChange();
			this.turnAxis = Math.floor(Math.random()*3);
			this.transCounter = 1;
		} else {
			for (var i=0; i<Props.GRID_LEN; i++) {
				for (var j=0; j<Props.GRID_LEN; j++) {
					for (var k=0; k<Props.GRID_LEN; k++) {
						(this.cells[i][j][k]).visualChange(this.transCounter);
					}
				}
			}
		}
			this.transCounter++;
			if (this.transCounter > Props.MAX_TRANS)
				this.transCounter = 0;
	},
	stateChange:function() {
		// calculate next state
		for (var i=0; i<Props.GRID_LEN; i++) {
			for (var j=0; j<Props.GRID_LEN; j++) {
				for (var k=0; k<Props.GRID_LEN; k++) {
					var willLive = this.aliveNextState(i, j, k);
					(this.cells[i][j][k]).newAliveState(willLive);
				}
			}
		}
		
		// update the cells
		for (var i=0; i<Props.GRID_LEN; i++) {
			for (var j=0; j<Props.GRID_LEN; j++) {
				for (var k=0; k<Props.GRID_LEN; k++) {
					(this.cells[i][j][k]).updateState();
					(this.cells[i][j][k]).visualChange(0);
				}
			}
		}
		
	}, 
	aliveNextState:function(i, j, k) {
		var numberLiving = 0;
		for (var r=i-1; r <= i+1; r++) {
			for (var s=j-1; s <= j+1; s++) {
				for (var t=k-1; t <= k+1; t++) {
					if ((r==i) && (s==j) && (t==k))
						continue;
					else if (this.isAlive(r,s,t))
						numberLiving++;
				}
			}
		}

		currentAliveState = this.isAlive(i,j,k);
		
		if (this.birthRange[numberLiving] == true && !currentAliveState)
			return true;
		else if (this.dieRange[numberLiving] == true && currentAliveState)
			return false;
		else return currentAliveState;
	},
	isAlive:function(i, j, k) {

		i = this.rangeCorrect(i);
		j = this.rangeCorrect(j);
		k = this.rangeCorrect(k);

		return (this.cells[i][j][k]).isAlive();
	},
	rangeCorrect:function(index) {
		if (index < 0)
			return (Props.GRID_LEN + index);
		else if (index > Props.GRID_LEN-1)
			return (index - Props.GRID_LEN);
		else return index;
	}
});
