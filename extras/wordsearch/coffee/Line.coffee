class Line

	constructor: (@startPos, @endPos) ->
		pathData = "M#{@startPos.getX()+25} #{startPos.getY()+25}"+
			"L#{@endPos.getX()+25} #{@endPos.getY()+25}"
		@path = game.paper.path(pathData)
	attr: (attrs) ->
		@path.attr attrs
		
	
window.Line = Line
