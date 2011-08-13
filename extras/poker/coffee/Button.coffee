class Button
    constructor: (@options) ->
        if @options.dims isnt undefined
            @rect = paper.rect(0,0, @options.dims.x, @options.dims.y, 10)
        else @rect = paper.rect(0, 0, 150, 50, 10)
        if (@options.color isnt undefined)
            @rect.attr({
                fill:options.color
                stroke:'#000'
            })
        else 
            @rect.attr({
                fill:'blue'
                stroke:'#000'
            })
        @text = paper.print(@options.x, @options.y, @options.text, paper.getFont("Droid Sans", "bold"), @options.fontSize)
        @text.attr({fill:'white'})
    
    setText: (text) ->
        @text.remove()
        @text = paper.print(@options.x, @options.y, text, paper.getFont("Droid Sans", "bold"), @options.fontSize)
        @text.translate(@x, @y)
        @text.attr({fill:'white'})
    
    translate: (@x,@y) ->
        @rect.translate(@x,@y)
        @text.translate(@x,@y)
    
    setOnClick: (@func) ->
        @rect.click(@func)
        @text.click(@func)
        @rect.attr({"cursor":"pointer"})
        @text.attr({"cursor":"pointer"})
        
        
    remove: () ->
        @rect.remove()
        @text.remove()
            
window.Button = Button