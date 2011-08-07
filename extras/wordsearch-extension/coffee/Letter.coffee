class Letter
	sideLength = 40
	offset = 0
	constructor: (@letter) ->
		
	draw: ->
		@rect = paper.rect @position.getX(), @position.getY(), sideLength, sideLength
		@rect.attr {'fill':'black'}
		self = this # local var to avoid 'this' collisions
		# TODO: set rectangle attr
		x = @position.getX()+15
		y = @position.getY()+25
		@text = paper.print x, y, @letter.toUpperCase(), paper.getFont("Droid Sans", "bold"), 28
		@text.attr {'fill':'white'}
	 # console.log @letter
		mouseOver = (event) ->
			state = game.isSelecting
			if state is yes
				self.text.attr {fill: 'red'}
				if self instanceof Letter
					game.tempWord.push self
			else 
				self.text.attr {fill: 'blue'}
		mouseOut = (event) ->
			# shouldn't transition if mousedown
			if game.isSelecting is false
				self.text.attr {fill: 'white'}
		mouseDown = (event) ->
			#start tracking position 
			state = game.isSelecting
			
			if state is no
				game.tempWord = new LetterSet()
				game.isSelecting = yes 
				game.tempWord.push self   
				self.text.attr {fill: "red"}
			else 
				
				game.isSelecting = no
				game.findWord()
				game.clearStates()
				# TODO check word here
		
		@rect.mouseover(mouseOver)
		@rect.mouseout(mouseOut)
		@rect.mousedown(mouseDown)
		
		@text.mouseover(mouseOver)
		@text.mouseout(mouseOut)
		@text.mousedown(mouseDown)
		
	
	setPosition: (@position) ->
	
	getPosition: ->
		@position
	
	getText: ->
		@letter

	equals: (letter2) ->
		if letter2 instanceof Letter 
			if @position is letter2.position and @letter is letter2.letter
					return true
    	return false

window.Letter = Letter
