window.bl = new Object();
window.blassets = new Object();
window.dude = new Array();

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
	var green = ev.target.parent.getChildByName('movegrid');
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
			//grid
			var grid = new createjs.Container();

			grid.x = 825 + (window.maze.SQWIDTH/2+1) * i - (window.maze.SQWIDTH/2+1) * (j + 1);
			grid.y = (window.maze.SQHEIGHT/2+1) * i + (window.maze.SQHEIGHT/2+1) * j;

			grid.name = 'grid' + i + 'x' + j;
			window.maze.board[i][j] = grid;
			
			var square = new createjs.Shape();
			square.graphics.beginStroke('000000').moveTo(window.maze.SQWIDTH/2+1,0);
			square.graphics.lineTo(window.maze.SQWIDTH+1,window.maze.SQHEIGHT/2+1);
			square.graphics.lineTo(window.maze.SQWIDTH/2+1,window.maze.SQHEIGHT+1);
			square.graphics.lineTo(0,window.maze.SQHEIGHT/2+1);
			square.graphics.lineTo(window.maze.SQWIDTH/2+1,0).endStroke();
			
			square.x = 0;
			square.y = 0;
			square.hitArea = hitarea;
			square.row = j;
			square.col = i;
			
			square.name = 'basegrid';
			square.addEventListener('click', testRadius);
			square.cache(0,0,window.maze.SQWIDTH+1,window.maze.SQHEIGHT+1);
			
			grid.addChild(square);

			//movement cover
			square = new createjs.Shape();
			square.graphics.beginFill('00FF00').moveTo(window.maze.SQWIDTH/2+1,0);
			square.graphics.lineTo(window.maze.SQWIDTH+1,window.maze.SQHEIGHT/2+1);
			square.graphics.lineTo(window.maze.SQWIDTH/2+1,window.maze.SQHEIGHT+1);
			square.graphics.lineTo(0,window.maze.SQHEIGHT/2+1);
			square.graphics.lineTo(window.maze.SQWIDTH/2+1,0).endFill();
			square.alpha = 0;
			
			square.x = 0;
			square.y = 0;
			
			square.name = 'movegrid';
			square.cache(0,0,window.maze.SQWIDTH+1,window.maze.SQHEIGHT+1);
			
			grid.addChild(square);

			//target cover
			square = new createjs.Shape();
			square.graphics.beginFill('FF0000').moveTo(window.maze.SQWIDTH/2+1,0);
			square.graphics.lineTo(window.maze.SQWIDTH+1,window.maze.SQHEIGHT/2+1);
			square.graphics.lineTo(window.maze.SQWIDTH/2+1,window.maze.SQHEIGHT+1);
			square.graphics.lineTo(0,window.maze.SQHEIGHT/2+1);
			square.graphics.lineTo(window.maze.SQWIDTH/2+1,0).endFill();
			square.alpha = 0;
			
			square.x = 0;
			square.y = 0;
			
			square.name = 'targetgrid';
			square.cache(0,0,window.maze.SQWIDTH+1,window.maze.SQHEIGHT+1);
			
			grid.addChild(square);
			
			square = new createjs.Container();

			square.x = window.maze.SQWIDTH/2+1;
			square.y = Math.floor(window.maze.SQHEIGHT * 0.75);

			square.name = 'char';
			grid.addChild(square);

			stage.addChild(grid);
		}
	}
	bl.updateDudes();
	stage.update();
	
	// begin loading content (only sounds to load)
	var assetsPath = "assets/";
	manifest = [
		{id:"movement", src:assetsPath+"movement.mp3"}
	];

	preload = new createjs.LoadQueue();
	preload.installPlugin(createjs.Sound);
	preload.addEventListener("complete", doneLoading);
	//preload.addEventListener("progress", updateLoading);
	preload.loadManifest(manifest);
}

function doneLoading()
{
	// start the music
    createjs.Sound.play("movement");
}

function addChar(ca,square)
{
	var chars = square.getChildByName('char');
	if (chars.getNumChildren() > 0)
		return false;
	ca.x = 0 - Math.floor(ca.image.width/2);
	ca.y = 0 - ca.image.height;
	chars.addChild(ca);
	return true;
}
function removeChar(square)
{
	var chars = square.getChildByName('char');
	chars.removeAllChildren();
	return true;
}

function clearAll()
{
	for (var i = 0; i < window.maze.BOARDSIZE; i++)
	{
		for (var j = 0; j < window.maze.BOARDSIZE; j++)
		{
			window.maze.board[i][j].getChildByName('movegrid').alpha = 0;
			window.maze.board[i][j].getChildByName('targetgrid').alpha = 0;
			window.maze.board[i][j].getChildByName('char').removeAllChildren();
		}
	}
}

function setHighlights(rad, type)
{
	for (var key in rad)
	{
		window.maze.board[rad[key].y][rad[key].x].getChildByName(type + 'grid').alpha = 0.25;
	}
}

function testRadius(ev)
{
	addChar(window.dude[0].image,ev.target.parent);
	window.dude[0].row = ev.target.row;
	window.dude[0].col = ev.target.col;
	setHighlights(bl.dude_move_radius(window.dude[0]), 'move');
	window.maze.stage.update();
}