class Letter
	sideLength = 50
	offset = 0
	constructor: (@letter) ->
		
	draw: ->
		@rect = game.paper.rect @position.getX(), @position.getY(), sideLength, sideLength
		@rect.attr {'fill':'black'}
		self = this # local var to avoid 'this' collisions
		# TODO: set rectangle attr
		x = @position.getX()+15
		y = @position.getY()+25
		@text = game.paper.print x, y, @letter.toUpperCase(), game.paper.getFont("Droid Sans", "bold"), 28
		@text.attr {'fill':'white'}
	 # console.log @letter
		mouseOver = (event) ->
			state = game.isSelecting
			if state is yes
				this.attr {fill: 'red'}
				console.log game.tempWord
				game.tempWord.push self
			else 
				this.attr {fill: 'blue'}
		mouseOut = (event) ->
			# shouldn't transition if mousedown
			if game.isSelecting is false
				this.attr {fill: 'black'}
		mouseDown = (event) ->
			#start tracking position 
			state = game.isSelecting
			
			if state is no
				game.tempWord = new LetterSet()
				game.isSelecting = yes 
				game.tempWord.push self   
				this.attr {fill: "red"}
			else 
				
				game.isSelecting = no
				game.findWord()
				game.clearStates()
				# TODO check word here
		mouseUp = (event) ->
			this.attr {fill: 'black'}
		
		@rect.mouseover(mouseOver)
		@rect.mouseout(mouseOut)
		#@text.mousedown(mouseDown)
		@rect.mousedown(mouseDown)
		#@text.mouseup(mouseUp)
		@rect.mouseup(mouseUp)
		
	
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
