window.maze = new Object();
window.maze.SQHEIGHT = 74;
window.maze.SQWIDTH = 126;
window.maze.BOARDSIZE = 13;
window.maze.board = new Array();
for (var i = 0; i < 13; i++)
{
	window.maze.board[i] = new Array();
}
	

function init() {
window.maze.stage = new createjs.Stage("myCanvas");
var stage = window.maze.stage;
var fill = '000000';

for (var i = 0; i < window.maze.BOARDSIZE; i++)
{
	for (var j = 0; j < window.maze.BOARDSIZE; j++)
	{
		var square = new createjs.Shape();
		square.graphics.beginStroke(fill).moveTo(window.maze.SQWIDTH/2+1,0);
		square.graphics.lineTo(window.maze.SQWIDTH+1,window.maze.SQHEIGHT/2+1);
		square.graphics.lineTo(window.maze.SQWIDTH/2+1,window.maze.SQHEIGHT+1);
		square.graphics.lineTo(0,window.maze.SQHEIGHT/2+1);
		square.graphics.lineTo(window.maze.SQWIDTH/2+1,0).endStroke();
		
		square.x = 825 + (window.maze.SQWIDTH/2+1) * i - (window.maze.SQWIDTH/2+1) * (j + 1);
		square.y = (window.maze.SQHEIGHT/2+1) * i + (window.maze.SQHEIGHT/2+1) * j;
		
		square.name = 'grid' + i + 'x' + j;
		window.maze.board[i][j] = square;
		
		stage.addChild(square);
	}
	stage.update();
}
}
