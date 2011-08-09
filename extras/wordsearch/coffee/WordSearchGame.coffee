class Game
  constructor: (@name) ->

class WordSearchGame extends Game
		constructor: (@rawPuzzles)->
			@name = "Word Search"
			@gridSize = 10
			@isSelecting = false
			@tempWord = new LetterSet()
			@userData
			@puzzle
			@words
			@currentPuzzle = 0
			@wordLines = []
			# draw game board
			@paper = Raphael(0,0, 700, 575)
			window.paper = @paper
			@parsePuzzles()
			@setPuzzle(0)
			
		
		drawButtons: () ->
			@prevButton = new Button({x:15, y:20, fontSize:24, text:"Previous", dimensions:{ w:125, h:35} })
			@prevButton.translate(550, 455)
			@nextButton = new Button({x:35, y:20, fontSize:24, text:"Next", dimensions:{ w:125, h:35} })
			@nextButton.translate(550, 500)
			
			@nextButton.setOnClick ()->
				window.nextPuzzle()
			@prevButton.setOnClick () ->
				window.previousPuzzle()
		
		parsePuzzles: () ->
			@puzzles = []
			for i in [0...@rawPuzzles.length]
				p = new WordSearchPuzzle(@rawPuzzles[i])
				@puzzles.push(p)
		
		setPuzzle: (i) ->
			if @puzzles[i] isnt undefined
				@puzzle = @puzzles[i] 
				@paper.clear()
				@letterGrid = [[],[],[],[],[],[],[],[],[],[]]
				@title = @paper.print(25, 25, "#{@puzzle.title}", @paper.getFont("Droid Sans", "bold"), 36);
				@title.attr {'fill': 'white'}
				@wordListTitle = @paper.text(600, 60, "Word List");
				@wordListTitle.attr {'font-size':24, 'fill': 'white'}				
				@populate()
				@currentPuzzle = i
				@drawButtons()
				
		populate: ->    
			upperCaseGrid = @puzzle.grid.toUpperCase()
			l = 0
			@createWordList()
			for j in [0...10]
				for k in [0...10]
					#console.log("j:#{j} k:#{k}")
					letter = new Letter(upperCaseGrid.charAt(l))
					letter.setPosition(new Position(j*50+25, k*50+50))
					#console.log letter
					@letterGrid[j].push(letter)
					l++
			return
			
		
		drawGrid: ->
			for j in [0...@gridSize]
				for k in [0...@gridSize]
					#console.log "Drawing at position:#{@letterGrid[j][k].getPosition()}"
					@letterGrid[j][k].draw()
			return
		
		createWordList: ->
			# TODO use relative positions instead of absolute
			startingPosition = new Position(0,0)
			@words = []
			i = 0
			for word in @puzzle.words
				wordText = @paper.text(600,90+(i*20), word)
				wordText.attr {'font-size':18, 'fill': 'white'}
				@words.push {text:word.toUpperCase(), svgObject:wordText}
				i++
		findWord: ->
			word = @tempWord.getLetters()
			for obj in @words
				# remove spaces
				w = obj.text.toString().replace(' ','')
				if w == word
					#found the word
					#change color to gray
					obj.svgObject.attr {fill:'black'}
					#draw line
					@drawLine()
					break
			return
		
		clearStates: ->
			for j in [0...@gridSize]
				for k in [0...@gridSize]
					#console.log "Drawing at position:#{@letterGrid[j][k].getPosition()}"
					@letterGrid[j][k].text.attr {fill:'white'}  
			return
			
		drawLine: ->
			start = @tempWord.get(0).getPosition()
			end = @tempWord.get(@tempWord.size()-1).getPosition()
			line = new Line(start, end)
			line.attr {stroke: 'green', 'stroke-width': 3}
			@wordLines.push line
window.WordSearchGame = WordSearchGame
