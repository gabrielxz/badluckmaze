window.bl = new Object();
window.blassets = new Object();
window.dude = new Array();

window.maze = new Object();
window.maze.SQHEIGHT = 64;
window.maze.SQWIDTH = 109;
window.maze.BOARDSIZE = 13;
window.maze.VOFFSET = 110;
window.maze.HOFFSET = 960;
window.maze.board = new Array();
for (var i = 0; i < window.maze.BOARDSIZE; i++)
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

	var board = new createjs.Bitmap('assets/board.png');
	stage.addChild(board);
	
	// begin loading sounds - Gabriel's code
	var assetsPath = "assets/";
	manifest = [
		{id:"movement", src:assetsPath+"movement.mp3"}, {id:"mainGameMusic", src:assetsPath+"mainGameMusic.mp3"},
		{id:"archerAttack", src:assetsPath+"archerAttack2.mp3"},{id:"blueWins", src:assetsPath+"blueWins.mp3"},
		{id:"death", src:assetsPath+"deathScream.mp3"},{id:"diceRoll", src:assetsPath+"diceRoll.mp3"},
		{id:"fightPopupTransition", src:assetsPath+"fightPopupTransition.mp3"},{id:"morrighanTotem", src:assetsPath+"morrighanTotem.mp3"},
		{id:"nomofo", src:assetsPath+"nomofo.mp3"},{id:"redWins", src:assetsPath+"redWins.mp3"},
		{id:"splashPageMusic", src:assetsPath+"splashPageMusic.mp3"},{id:"warriorAttack", src:assetsPath+"warriorAttack.mp3"},
		{id:"knightAttack", src:assetsPath+"knightAttack.mp3"}
	];
	preload = new createjs.LoadQueue();
	preload.installPlugin(createjs.Sound);
	preload.addEventListener("complete", doneLoading);
	preload.loadManifest(manifest);
	// end loading sounds
	
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

			grid.x = window.maze.HOFFSET + (window.maze.SQWIDTH/2+1) * i - (window.maze.SQWIDTH/2+1) * (j + 1);
			grid.y = window.maze.VOFFSET +(window.maze.SQHEIGHT/2+1) * i + (window.maze.SQHEIGHT/2+1) * j;

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
			square.alpha = 1;
			
			square.name = 'basegrid';
			square.addEventListener('click', bl.onGridClick);
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

			square.name = 'misc';
			grid.addChild(square);

			square = new createjs.Container();

			square.x = window.maze.SQWIDTH/2+1;
			square.y = Math.floor(window.maze.SQHEIGHT * 0.75);

			square.name = 'char';
			grid.addChild(square);

			stage.addChild(grid);
		}
	}
	//modal cover sheet
	grid = new createjs.Container();
	grid.name = 'modal'
	grid.alpha = 1;
	stage.addChild(grid);
	window.maze.modal = grid; 

	square = new createjs.Shape();
	square.graphics.beginFill('FFFFFF').rect(0,0,stage.canvas.width,stage.canvas.height);
	square.alpha = 0.5;
	grid.addChild(square);

	//fight page
	grid = new createjs.Container();
	grid.name = 'fightpage'
	grid.alpha = 1;
	grid.x = 580;
	grid.y = 200;
	stage.addChild(grid);
	window.maze.fightpage = grid; 

	square = new createjs.Shape();
	square.graphics.beginFill('000000').rect(0,0,800,500);
	square.alpha = 1;
	grid.addChild(square);
	
	//player 1 portrait
	square = new createjs.Shape();
	square.graphics.beginFill('0000FF').rect(40,70,250,300);
	square.alpha = 1;
	grid.addChild(square);
	
	//player 2 portrait
	square = new createjs.Shape();
	square.graphics.beginFill('FF0000').rect(510,70,250,300);
	square.alpha = 1;
	grid.addChild(square);

	//player 1 dice
	square = new createjs.Bitmap('assets/dice/die_0.png');
	square.x = 30;
	square.y = 380;
	square.scaleX = 0.5;
	square.scaleY = 0.5;
	square.alpha = 1;
	grid.addChild(square);

	square = new createjs.Bitmap('assets/dice/die_0.png');
	square.x = 110;
	square.y = 380;
	square.scaleX = 0.5;
	square.scaleY = 0.5;
	square.alpha = 1;
	grid.addChild(square);
	
	//player 2 dice
	square = new createjs.Bitmap('assets/dice/die_0.png');
	square.x = 595;
	square.y = 380;
	square.scaleX = 0.5;
	square.scaleY = 0.5;
	square.alpha = 1;
	grid.addChild(square);

	square = new createjs.Bitmap('assets/dice/die_0.png');
	square.x = 675;
	square.y = 380;
	square.scaleX = 0.5;
	square.scaleY = 0.5;
	square.alpha = 1;
	grid.addChild(square);

	square = new createjs.Text('VS.', '50pt sans-serif', 'white');
	square.x = 335;
	square.y = 200;
	square.alpha = 1;
	grid.addChild(square);
	
	//player 1 unit name
	square = new createjs.Text('Blue Archer', '25pt sans-serif', 'white');
	square.x = 70;
	square.y = 20;
	square.alpha = 1;
	square.name = 'p1name';
	grid.addChild(square);
	
	//player 2 unit name
	square = new createjs.Text('Red Archer', '25pt sans-serif', 'white');
	square.x = 550;
	square.y = 20;
	square.alpha = 1;
	square.name = 'p2name';
	grid.addChild(square);
	
	//player 1 stats
	square = new createjs.Text('+ 4 Toughness\n= 4 Defense', '18pt sans-serif', 'white');
	square.x = 200;
	square.y = 380;
	square.alpha = 1;
	square.name = 'p1stats';
	grid.addChild(square);
	
	bl.updateDudes();
	bl.addTotems();
	stage.update();
}

function doneLoading()
{
	// start the music
    createjs.Sound.play("mainGameMusic", createjs.Sound.INTERRUPT_NONE, 0, 10000, 0, 0.3, 0);
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
			window.maze.board[i][j].getChildByName('basegrid').validMove = false;
			window.maze.board[i][j].getChildByName('basegrid').validAttack = false;
			window.maze.board[i][j].getChildByName('basegrid').origin = null;
		}
	}
}

function setHighlights(squares, type, origin)
{
	var square;

	for (var i in squares)
	{
		square = squares[i];
		switch (type)
		{
			case 'move':
				square.origin = origin;
				square.parent.getChildByName(type + 'grid').alpha = 0.25;
			break;
			case 'target':
				square.origin = origin;
				square.parent.getChildByName(type + 'grid').alpha = 0.25;
			break;
		}
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
