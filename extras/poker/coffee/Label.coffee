###
@author jwill

Format:
fill = (container, liquid = "coffee") ->
  "Filling the #{container} with #{liquid}..."

###


class Label
    constructor: (options) ->
        if options is undefined
            @fontSize = 36
        @text = null
        @textString
        @xPos = 0
        @yPos = 0
    setText: (text) ->
        @text.remove() if @text isnt null
        @textString = text
        @drawText()
        
    drawText: () ->
        @text = paper.print(@xPos,@yPos, @textString, paper.getFont("Droid Sans", "bold"), @fontSize)
 
    translate: (x, y) ->
        @xPos += x
        @yPos += y
        @text.remove()
        @drawText()

window.Label = Label