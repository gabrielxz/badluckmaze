bl.GameStatus = 'CharSelection';
bl.CurrPlayer = 0;


bl.onGridClick = function(ev)
{
	switch(GameStatus)
	{
		case 'Player1CharSelection':
			clearAll();
			bl.updateDudes();
			if (hasActiveChar(ev.target))
			{
				setHighlights(bl.dude_move_radius(getChar(ev.target).dude), 'move');
			}
			break;
	}
	window.maze.stage.update();
}

bl.hasActiveChar = function(square)
{
	var ch = square.parent.getChildByName('char');
	if (ch == null)
		return false;
	if (ch.getNumChildren() < 1)
		return false;
	ch = ch.getChildAt(0);
	if (ch.dude.player == bl.CurrPlayer)
		return true;
	return false;
}

bl.getChar = function(square)
{
	var ch = square.parent.getChildByName('char');
	if (ch == null)
		return null;
	if (ch.getNumChildren() < 1)
		return null;
	ch = ch.getChildAt(0);
	return ch;
}

bl.updateDudes = function()
{
	for(var x in window.dude)
	{
		var d = dude[x];
		addChar(d.image,window.maze.board[d.col][d.row]);
	}
}