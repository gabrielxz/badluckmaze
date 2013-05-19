bl.GameStatus = 'CharSelection';
bl.CurrPlayer = 0;


bl.onGridClick = function(ev)
{
	switch(bl.GameStatus)
	{
		case 'CharSelected':
			if (ev.target.validMove)
			{
				addChar(ev.target.origin.image, ev.target.parent);
				ev.target.origin.row = ev.target.row;
				ev.target.origin.col = ev.target.col;
				ev.target.origin.canMove = false;
			}
			else if (ev.target.validAttack)
			{
				//StartCombat()
				alert('Mortal Kombat!!');
				ev.target.origin.canMove = false;
				ev.target.origin.canAttack = false;
			}
		case 'CharSelection':
			clearAll();
			bl.updateDudes();
			if (bl.hasActiveChar(ev.target))
			{
				if (bl.getChar(ev.target).dude.canMove)
					setHighlights(bl.dude_move_radius(bl.getChar(ev.target).dude), 'move', bl.getChar(ev.target).dude);
				if (bl.getChar(ev.target).dude.canAttack)
					setHighlights(bl.dude_fight_radius(bl.getChar(ev.target).dude), 'target', bl.getChar(ev.target).dude);
				bl.GameStatus = 'CharSelected';
			}
			else
			{
			    bl.GameStatus = 'CharSelection';
			}
			break;
	}
	window.maze.stage.update();
}

bl.endTurn = function()
{
	bl.CurrPlayer = (bl.CurrPlayer ? 0 : 1);
	bl.GameStatus = 'CharSelection';
	bl.resetDudes();
	clearAll();
}

bl.hasActiveChar = function(square)
{
	var ch = bl.getChar(square);
	if (ch == null)
		return false;
	if (ch.dude.owner == bl.CurrPlayer)
		return true;
	return false;
}

bl.hasEnemyChar = function(square)
{
	var ch = bl.getChar(square);
	if (ch == null)
		return false;
	if (ch.dude.owner != bl.CurrPlayer)
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

bl.resetDudes = function()
{
	for(var x in window.dude)
	{
		var d = dude[x];
		d.canMove = true;
		d.canAttack = true;
	}
}