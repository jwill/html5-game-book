var MiniMax = Class.create({
	initialize: function() {
		this.depthLimit = 400;
		this.currentDepth = 0;
	},
	miniMax: function(board, currentPlayer) {
		if (this.currentDepth == this.depthLimit)
			return 0;
		if (TTT.checkForWin(board) == currentPlayer)
			return 1;
		if (TTT.checkForWin(board) == this.getOtherPlayer(currentPlayer))
			return -1;
		this.currentDepth++;
		var best = -10;
		var bestMove = null;
		var clone = TTT.cloneGameBoard(board);
		var moves = TTT.generateMovesFromBoard(clone, currentPlayer);

		for (var i = 0; i<moves.length; i++) {
			var m = moves[i]
			clone[m[0]][m[1]] = currentPlayer;
			var value = -this.miniMax(clone, this.getOtherPlayer(currentPlayer));
					
			//reset board
			clone[m[0]][m[1]] = "";
			if (value > best) {
				best = value;
				bestMove = m;
			}
		}
		
		if (best == -10)
			return 0
		return bestMove;
	},
	getOtherPlayer: function(player) {
		return player=="X" ? "O" : "X";
	},
	printBoard: function(board) {
		for (var i = 0; i<3; i++) {
			var a = board[i][0];
			var b = board[i][1];
			var c = board[i][2];
			// Prints a dash if the cell is blank
			console.log((a==="" ? "-" : a) + (b==="" ? "-" : b) + (c==="" ? "-" : c));
		}
	},
	limitReached: function() {
		return this.currentDepth == this.depthLimit;
	}
});
