#Collection class that enforces uniques
class Set
	constructor: ->
		@rawArray = []
	
	push: (obj) ->
		if @contains(obj) is -1
			@rawArray.push(obj)
	
	get: (index) ->
		@rawArray[index]
	
	remove: (obj) ->
		index = @contains(obj)
		@rawArray.remove(index) if index isnt undefined
	
	contains: (obj) ->
		for obj2,i in @rawArray
			return i if obj.equals(obj2)
		return -1
		
	size: ->
		return @rawArray.length
    
	clear: ->
		@rawArray = []

class LetterSet extends Set
	getLetters: ->
		temp = ""
		for obj in @rawArray
			temp = temp + obj.letter[0]
		temp

window.Set = Set
window.LetterSet = LetterSet
