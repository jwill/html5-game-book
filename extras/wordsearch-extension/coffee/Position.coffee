class Position
  constructor: (@x, @y) ->

  getPosition: ->
    this

  getX: -> @x
  getY: -> @y

  toString: ->
    "x:#{@x} y:#{@y}"

  equals: (pos2) ->
    console.log("pos: "+@toString()+ " pos2: "+pos2.toString())
    console.log @getX() is pos2.getX() and @getX() is pos2.getX()
    return @getX() is pos2.getX() and @getX() is pos2.getX()


window.Position = Position