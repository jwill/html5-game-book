class Game
  constructor: (@name) ->

class WordSearchGame extends Game
		constructor: (@puzzle)->
			@name = "Word Search"
			@gridSize = 10
			@isSelecting = false
			@letterGrid = [[],[],[],[],[],[],[],[],[],[]]
			@tempWord = new LetterSet()
			@userData
			@puzzle
			@words
			@wordLines = []
			# draw game board
			@paper = Raphael(0,0, 800, 800)
			@bg = @paper.image("images/bg.png", 0, 0, 800, 800)
			@title = @paper.text(200, 25, "#{@puzzle.title}");
			@title.attr {'font-size':36, 'fill': 'white'}
			@wordListTitle = @paper.text(600, 60, "WordList");
			@wordListTitle.attr {'font-size':20, 'fill': 'white'}
			@populate()
			
		populate: ->    
			upperCaseGrid = @puzzle.grid.toUpperCase()
			l = 0
			console.log("here")
			@createWordList()
			for j in [0...10]
				for k in [0...10]
					#console.log("j:#{j} k:#{k}")
					letter = new Letter(upperCaseGrid.charAt(l))
					letter.setPosition(new Position(j*50+25, k*50+50))
					#console.log letter
					@letterGrid[j].push(letter)
					l++
		
		drawGrid: ->
			for j in [0...@gridSize]
				for k in [0...@gridSize]
					#console.log "Drawing at position:#{@letterGrid[j][k].getPosition()}"
					@letterGrid[j][k].draw()
		
		createWordList: ->
			# TODO use relative positions instead of absolute
			startingPosition = new Position(0,0)
			@words = []
			i = 0
			for word in @puzzle.words
				wordText = @paper.text(600,85+(i*20), word)
				wordText.attr {'font-size':18, 'fill': 'white'}
				@words.push {text:word.toUpperCase(), svgObject:wordText}
				i++
		findWord: ->
			word = @tempWord.getLetters()
			for obj in @words
				if obj.text.toString() == word
					#found the word
					#change color to gray
					obj.svgObject.attr {fill:'gray'}
					#draw line
					@drawLine()
					break
			return
		
		clearStates: ->
			for j in [0...@gridSize]
				for k in [0...@gridSize]
					#console.log "Drawing at position:#{@letterGrid[j][k].getPosition()}"
					@letterGrid[j][k].rect.attr {fill:'black'}  
			return
			
		drawLine: ->
			start = @tempWord.get(0).getPosition()
			end = @tempWord.get(@tempWord.size()-1).getPosition()
			line = new Line(start, end)
			line.attr {stroke: 'green', 'stroke-width': 3}
			@wordLines.push line
window.WordSearchGame = WordSearchGame
