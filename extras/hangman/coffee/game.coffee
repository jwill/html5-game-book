class Game
	constructor: () ->
		@ctx = document.getElementById("c").getContext("2d")
		@drawStructure()
		@letters = "abcdefghijklmnopqrstuvwxyz"
		@incorrectTries = 0
		@drawHead()
		@drawNeck()
		@drawArm("left")
		@drawArm("right")
		@drawTorso()
		@drawLeg("left")
		@drawLeg("right")
		
	drawStructure: () ->
		@ctx.save()
		@ctx.lineWidth = 2
		@ctx.beginPath()
		@ctx.moveTo(0,600)
		@ctx.lineTo(300,600)
		
		@ctx.moveTo(100,0)
		@ctx.lineTo(100, 600)
		
		@ctx.moveTo(100,0)
		@ctx.lineTo(400,0)
		
		@ctx.lineTo(400,50)
		@ctx.stroke()
		@ctx.restore()
		
	drawHead: () ->
		@ctx.save()
		@ctx.translate(400,100)
		@ctx.moveTo(0,0)
		@ctx.arc(0,0, 50, 0, 2*Math.PI)
		@ctx.stroke()
		@ctx.restore()
		
	drawNeck: () ->
		@ctx.save()
		@ctx.translate(400,150)
		@ctx.moveTo(0,0)
		@ctx.lineTo(0,50)
		@ctx.stroke()
		@ctx.restore()
		
	drawArm: (arm) ->
		@ctx.save()
		if arm is "left"
			@ctx.translate(300,200)	
		if arm is "right"
			@ctx.translate(400,200)
		@ctx.moveTo(0,0)
		@ctx.lineTo(100,0)
		@ctx.stroke()
		@ctx.restore()
		
	drawTorso: () ->
		@ctx.save()
		@ctx.translate(400,200)
		@ctx.moveTo(0,0)
		@ctx.lineTo(0, 150)
		@ctx.stroke()
		@ctx.restore()
		
	drawLeg: (leg) ->
		@ctx.save()
		@ctx.translate(400,350)
		@ctx.moveTo(0,0)
		if leg is "right"
			@ctx.lineTo(60,100)
		if leg is "left"
			@ctx.lineTo(-60,100)
		@ctx.stroke()
		@ctx.restore()
		
		
		
window.Game = Game
