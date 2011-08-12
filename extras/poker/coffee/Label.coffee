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
        else 
            @fontSize = options.fontSize if options.fontSize
            @textString = options.text if options.text
            @text = null
            @xPos = options.x if options.x
            @yPos = options.y if options.y
            @attrList = options.attrList if options.attrList
            @drawText()
            
        return
    setText: (text) ->
        @text.remove() if @text isnt null
        @textString = text
        @drawText()
        
    drawText: () ->
        @text = paper.print(@xPos,@yPos, @textString, paper.getFont("Droid Sans", "bold"), @fontSize)
        @text.attr(@attrList) if @attrList
        return
 
    translate: (x, y) ->
        @xPos += x
        @yPos += y
        @text.remove()
        @drawText()

window.Label = Label