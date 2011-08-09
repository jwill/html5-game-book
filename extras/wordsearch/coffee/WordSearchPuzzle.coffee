class WordSearchPuzzle
  @guid
  @words = []
  @title
  @grid

  constructor: (data) ->
    @guid = data.guid
    @title = data.title
    @words = data.words
    @grid = data.grid

window.WordSearchPuzzle = WordSearchPuzzle