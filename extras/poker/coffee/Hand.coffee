# @author jwill
#
# After deal
# States for cards:
# true  --- held
# false --- draw card
#

class Hand
    constructor: () ->
        @cards = []
        @pos = 0
    
    toggleHeldCard: (position) ->
        
    addToHand: (card) ->
        if @cards.length isnt 5
            card.positionInHand = @pos++
            card.state = false;
            @cards.push(card)
        else
            num = @findCardToReplace()
            if num isnt null
                card.state = true;
                card.positionInHand = num
                @cards[num].trashCard()
                @cards[num] = card
        
    findCardToReplace: () ->
        for i in [0..5]
            return i if @cards[i].state is false
        return null
    
    cardsNeeded: () ->
        if @cards.length isnt 5
            return 5
        else
            cards = 0
            for i in [0...5]
                cards++ if @cards[i].state is false
            return cards
    
    drawCards: () ->
        for i in [0...5]
            @cards[i].drawCard()
            
    flipCards: () ->
        for i in [0...5]
            @cards[i].flipCard() if @cards[i].frontShown isnt true
        
    clearCards: () ->
        for i in [0...5]
            @cards[i].trashCard()
        @cards = []
        @pos = 0
window.Hand = Hand