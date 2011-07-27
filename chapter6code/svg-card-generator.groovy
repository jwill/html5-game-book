// Groovy script to generate script to export pngs from svg-cards

def ord = [1,2,3,4,5,6,7,8,9,10,'jack', 'queen', 'king']
def suit = ['club', 'diamond', 'spade', 'heart']
def dpi = 90
def text = ""
suit.each { s ->
    ord.each { o->
        text += "inkscape -f svg-cards.svg -i ${o}_${s} -e ${o}_${s}.png -d " + dpi +"\n"
    }
    
}
def f = new File("svg-cards-${dpi}.sh")
f.write("#!/bin/bash\n")
f.write(text)
