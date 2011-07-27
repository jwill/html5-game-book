class Set
    constructor: ->
        @rawArray = new Array()
    
    contains: (object) ->
        for obj,i  in @rawArray

            return i if object.x == obj.x and object.y == obj.y
        return undefined
    
    getLastCell: ->
        return @rawArray[ @size() - 1]
    
    remove: (object) ->
        index = @contains(object)
        @rawArray.remove(index)
    
    add: (object) ->
        @rawArray.push(object) if @contains(object) == undefined
        
    get: (index) ->
        @rawArray[index]
        
    size: ->
        @rawArray.length
        
window.Set = Set        