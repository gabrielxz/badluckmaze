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
queue = new createjs.LoadQueue(false);


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

		square.x = 0;
		square.y = 0;
		
		square.name = 'basegrid';
		
		var grid = new createjs.Container();

		grid.x = 825 + (window.maze.SQWIDTH/2+1) * i - (window.maze.SQWIDTH/2+1) * (j + 1);
		grid.y = (window.maze.SQHEIGHT/2+1) * i + (window.maze.SQHEIGHT/2+1) * j;

		grid.name = 'grid' + i + 'x' + j;
		window.maze.board[i][j] = grid;
		
		grid.addChild(square);
		stage.addChild(grid);
	}
	stage.update();

}
}


