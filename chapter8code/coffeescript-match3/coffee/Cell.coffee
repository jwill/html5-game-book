#@colors = ['red', 'green','blue','yellow','black']
@colors = ['rgb(255,0,0)', 'rgb(0,255,0)', 'rgb(0,0,255)', 'rgb(255,255,0)', 'rgb(0,0,0)']
@sideLength = 25

class Cell
    
    constructor: (x,y,color) ->
        @x = x
        @y = y
        @hidden = false
        @selected = false
        @color = @pickRandomColor()
        @matchesMasterCell = false
        
    drawCell: ->
        if (@hidden is false and @selected isnt true)
          game.context.fillStyle = @color
        else if @hidden is true
          game.context.fillStyle = "rgb(0,0,0)"
        if @selected is true and @hidden isnt true
          game.context.fillStyle = "rgb(125,125,0)"
        game.context.fillRect(@x*sideLength, @y*sideLength, sideLength, sideLength)
    
    pickRandomColor: ->
        index = Math.floor Math.random() * 100 % (colors.length-1)
        @color = colors[index]
        
    compare: (cell) ->
        if cell.color is @color
            return true 
        else return false
        
    isNear: (cell) ->
        xResult = @x - cell.x
        yResult = @y - cell.y
        if xResult is 0 and ((yResult is 1) or (yResult is -1))
            return true
        else if yResult is 0 and ((xResult is 1) or (xResult is -1))
            return true
        return false
        
        
    reset: ->
        @matchesMasterCell = false
        @alreadyCheckedNeighors = false
        
        

window.Cell = Cell
window.sideLength = 25