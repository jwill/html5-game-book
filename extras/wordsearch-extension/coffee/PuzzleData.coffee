class PuzzleData
	@puzzleGuid
	@time
	@lines
	@lastPlayed
	@finished
	
	constructor: (data) ->
		@puzzleGuid = data.guid
		@time = data.times
		@lines = data.lines
		@lastPlayed = data.lastPlayed
		@finished = data.finished

window.PuzzleData = PuzzleData
