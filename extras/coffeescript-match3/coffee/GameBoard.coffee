# GameBoard class for Match 3 game
#
# @author: jwill
class GameBoard
    constructor: (x,y) ->
        # create grid
        @grid = new Array()
        @cellsToClear = new Set()
        @maxX = x
        @maxY = y
        for i in [0...x]
            array = new Array()
            for j in [0...y]
                array.push(new Cell(i, j))
            @grid.push(array)

    isValidCell: (cell) ->
        return false if cell.hidden is true
        return false if cell is null
        
        validX = @maxX > cell.x >= 0
        validY = @maxY > cell.y >= 0
        
        validX and validY

    clearCells: (set) ->
        if set.size() < 3
          for cell in set.rawArray
            x = cell.x
            y = cell.y
            @grid[x][y].selected = false
          return
        game.score += set.size() * 10
        for cell in set.rawArray
          x = cell.x
          y = cell.y
          @grid[x][y].hidden = true
          @grid[x][y].selected = false
        return
        # do stuff here
        # do more stuff here

    checkMatch: (x, y) ->
        cell = @grid[x][y]
        if @isValidCell cell
            if @cellsToClear.size() is 0
                cell.selected = true
                @cellsToClear.add (cell)
            else if @cellsToClear.getLastCell().compare(cell) and @cellsToClear.getLastCell().isNear cell
                cell.selected = true
                @cellsToClear.add (cell)
        
        @cellsToClear
                

    resetGrid: ->
        for i in [0...@maxX]
            for j in [0...@maxY]
                if @grid[i][j] != null
                    cell = @grid[i][j]
                    cell?.reset()
        @clear()
        @cellsToClear = new Set()
        @drawBoard()
                    
    drawBoard: ->
        for i in [0...@maxX]
            for j in [0...@maxY]
                if @grid[i][j] != null
                    cell = @grid[i][j]
                    cell.drawCell()
    
    clear: ->
        game.context.clearRect(0, 0, 375, 375);
        

window.GameBoard = GameBoard
            
        
