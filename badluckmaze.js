window.maze = new Object();
window.maze.SQHEIGHT = 74;
window.maze.SQWIDTH = 126;
window.maze.BOARDSIZE = 13;
window.maze.board = new Array();
for (var i = 0; i < 13; i++)
{
	window.maze.board[i] = new Array();
}

function toggleGreenHilight(ev)
{
	var green = ev.target.parent.getChildByName('greengrid');
	if (green.alpha == 0)
		green.alpha = 0.5;
	else
		green.alpha = 0;
	window.maze.stage.update();
}

function init() {
	window.maze.stage = new createjs.Stage("myCanvas");
	var stage = window.maze.stage;

	// grid
	var hitarea = new createjs.Shape();
	hitarea.graphics.beginFill('000000').moveTo(window.maze.SQWIDTH/2+1,0);
	hitarea.graphics.lineTo(window.maze.SQWIDTH+1,window.maze.SQHEIGHT/2+1);
	hitarea.graphics.lineTo(window.maze.SQWIDTH/2+1,window.maze.SQHEIGHT+1);
	hitarea.graphics.lineTo(0,window.maze.SQHEIGHT/2+1);
	hitarea.graphics.lineTo(window.maze.SQWIDTH/2+1,0).endFill();
	
	hitarea.x = 0;
	hitarea.y = 0;
	
	hitarea.name = 'hitarea';
	
	for (var i = 0; i < window.maze.BOARDSIZE; i++)
	{
		for (var j = 0; j < window.maze.BOARDSIZE; j++)
		{
			var grid = new createjs.Container();

			grid.x = 825 + (window.maze.SQWIDTH/2+1) * i - (window.maze.SQWIDTH/2+1) * (j + 1);
			grid.y = (window.maze.SQHEIGHT/2+1) * i + (window.maze.SQHEIGHT/2+1) * j;

			grid.name = 'grid' + i + 'x' + j;
			window.maze.board[i][j] = grid;
			
			//grid
			var square = new createjs.Shape();
			square.graphics.beginStroke('000000').moveTo(window.maze.SQWIDTH/2+1,0);
			square.graphics.lineTo(window.maze.SQWIDTH+1,window.maze.SQHEIGHT/2+1);
			square.graphics.lineTo(window.maze.SQWIDTH/2+1,window.maze.SQHEIGHT+1);
			square.graphics.lineTo(0,window.maze.SQHEIGHT/2+1);
			square.graphics.lineTo(window.maze.SQWIDTH/2+1,0).endStroke();
			
			square.x = 0;
			square.y = 0;
			square.hitArea = hitarea;
			
			square.name = 'basegrid';
			square.addEventListener('click', toggleGreenHilight);
			square.cache(0,0,window.maze.SQWIDTH+1,window.maze.SQHEIGHT+1);
			
			grid.addChild(square);

			//green cover
			square = new createjs.Shape();
			square.graphics.beginFill('00FF00').moveTo(window.maze.SQWIDTH/2+1,0);
			square.graphics.lineTo(window.maze.SQWIDTH+1,window.maze.SQHEIGHT/2+1);
			square.graphics.lineTo(window.maze.SQWIDTH/2+1,window.maze.SQHEIGHT+1);
			square.graphics.lineTo(0,window.maze.SQHEIGHT/2+1);
			square.graphics.lineTo(window.maze.SQWIDTH/2+1,0).endFill();
			square.alpha = 0;
			
			square.x = 0;
			square.y = 0;
			
			square.name = 'greengrid';
			square.cache(0,0,window.maze.SQWIDTH+1,window.maze.SQHEIGHT+1);
			
			grid.addChild(square);

			//red cover
			square = new createjs.Shape();
			square.graphics.beginFill('FF0000').moveTo(window.maze.SQWIDTH/2+1,0);
			square.graphics.lineTo(window.maze.SQWIDTH+1,window.maze.SQHEIGHT/2+1);
			square.graphics.lineTo(window.maze.SQWIDTH/2+1,window.maze.SQHEIGHT+1);
			square.graphics.lineTo(0,window.maze.SQHEIGHT/2+1);
			square.graphics.lineTo(window.maze.SQWIDTH/2+1,0).endFill();
			square.alpha = 0;
			
			square.x = 0;
			square.y = 0;
			
			square.name = 'redgrid';
			square.cache(0,0,window.maze.SQWIDTH+1,window.maze.SQHEIGHT+1);
			
			grid.addChild(square);

			stage.addChild(grid);
		}
		stage.update();
	}
}


