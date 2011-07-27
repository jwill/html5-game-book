/**
 * @author jwill
 */
paper = null
initWarGame = function () {
	// Remove current game board which may not be a canvas
	$("#playingArea").html(""); 
	paper = Raphael($("#playingArea").get(0), 800, 600);
	
	background = paper.rect(0, 0, 800, 600, 15);
        background.attr({
            fill:'#090',          /* fill with a greenish color */
            stroke:'#000'    /* draw a black border */
        });
        background.toBack();
}
