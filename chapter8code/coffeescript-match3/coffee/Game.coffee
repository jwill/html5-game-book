# Game class for Match 3 game
#
# @author: jwill
score = 0
class Game
    constructor: ->
        @gameboard = new GameBoard(15,15)
        @score = 0
        element = document.getElementById 'game'
        @context = element.getContext("2d")
        
        #mouse movements
        @isMouseDown = false
        
        @cellsToCheck = new Set()
        element.onmousedown = @onMouseDown;
        element.onmousemove = @onMouseMove;
        element.onmouseup = @onMouseUp;
    
    onMouseMove: (evt) ->
        if (@isMouseDown == true)
            x = Math.round(evt.clientX / sideLength) - 1
            y = Math.round( evt.clientY / sideLength) - 1 
            @cellsToCheck = game.gameboard.checkMatch(x,y)
            game.gameboard.drawBoard()
    
    onMouseDown: (evt) ->
        x = Math.round(evt.clientX / sideLength) - 1
        y = Math.round( evt.clientY / sideLength) - 1
        
        @isMouseDown = true
        @cellsToCheck = new Set()
        
        game.gameboard.checkMatch(x,y)
        
    onMouseUp: (evt) ->
        # send results to gameboard to check them
        @isMouseDown = false    
        game.gameboard.clearCells @cellsToCheck
        @cellsToCheck = null
        game.updateScore()
        game.gameboard.resetGrid()
    
    updateScore: ->
        scoreElement = document.getElementById("score")
        scoreElement.innerText = @score
        

window.Game = Game
window.score = score