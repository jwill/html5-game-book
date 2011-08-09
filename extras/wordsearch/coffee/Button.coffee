class Button
    constructor: (options) ->
        if (options.dimensions)
            @rect = paper.rect(0, 0, options.dimensions.w, options.dimensions.h, 10)
        else 
            @rect = paper.rect(0, 0, 150, 50, 10)
        if (options.color isnt undefined)
            @rect.attr({
                fill:options.color
                stroke:'#000'
            })
        else 
            @rect.attr({
                fill:'blue'
                stroke:'#000'
            })
        @text = paper.print(options.x, options.y, options.text, paper.getFont("Droid Sans", "bold"), options.fontSize)
        @text.attr({fill:'white'})
        console.log @text
    
    translate: (x,y) ->
        @rect.translate(x,y)
        @text.translate(x,y)
    
    setOnClick: (func) ->
        @rect.click(func)
        @text.click(func)
            
window.Button = Button