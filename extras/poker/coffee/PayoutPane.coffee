class PayoutPane
    constructor: () ->
        @payoutLabels = "Royal Flush\nStraight Flush\nFour of A Kind\nFull House\n" + 
        "Flush\nStraight\nThree of A Kind\nTwo Pair\nJacks Or Better"
        @attrList = {"text-anchor": "start", "font-size":24 }
        @attrList2 = {"text-anchor": "end", "font-size":24 }
        @col1X = 40
        @yCenter = 0
    draw: () ->
        @rect = paper.rect(@col1X - 40, @yCenter + 75, 400, 300, 10)
        @payoutCol1 = paper.text @col1X, @yCenter + 225, @payoutLabels
        @payoutCol1.attr(@attrList)
        values = _.values game.evaluator.basePayouts
        values.reverse()
        @payoutCol2 = paper.text @col1X+300, @yCenter + 225, values.join "\n"
        @payoutCol2.attr(@attrList2)
        
        #translate down 225 pix
        
    translate: (x, y) ->
        @col1X += x
        @yCenter += y
        
        @rect.remove() if @rect
        @payoutCol1.remove() if @payoutCol1
        @payoutCol2.remove() if @payoutCol2
        
        @draw()
        
window.PayoutPane = PayoutPane