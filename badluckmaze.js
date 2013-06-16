window.bl = new Object();
window.blassets = new Object();

window.maze = new Object();
window.maze.SQHEIGHT = 64;
window.maze.SQWIDTH = 109;
window.maze.BOARDSIZE = 13;
window.maze.VOFFSET = 110;
window.maze.HOFFSET = 960;

function init() {
	stage = new createjs.Stage("myCanvas");

	board.init();
	dudes.init();
	totems.init();
	dice.init();

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
	
	//modal cover sheet
	grid = new createjs.Container();
	grid.name = 'modal'
	grid.alpha = 0;
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
	grid.x = 480;
	grid.y = 100;
	window.maze.modal.addChild(grid);
	window.maze.fightpage = grid; 

	square = new createjs.Shape();
	square.graphics.beginFill('000000').rect(0,0,1000,700);
	square.alpha = 1;
	grid.addChild(square);
	
	//player 1 portrait
	square = new createjs.Shape();
	square.graphics.beginFill('0000FF').rect(40,70,300,400);
	square.alpha = 1;
	grid.addChild(square);
	
	//player 2 portrait
	square = new createjs.Shape();
	square.graphics.beginFill('FF0000').rect(660,70,300,400);
	square.alpha = 1;
	grid.addChild(square);

	setFightDice(dice.get_result_img(0, 0), dice.get_result_img(0, 1), 
	             dice.get_result_img(1, 0), dice.get_result_img(1, 1));

	square = new createjs.Text('VS.', '50pt sans-serif', 'white');
	square.x = 435;
	square.y = 100;
	square.alpha = 1;
	grid.addChild(square);

	square = new createjs.Text('Blue Archer', '40pt sans-serif', 'white');
	square.x = 355;
	square.y = 200;
	square.alpha = 1;
	square.name = 'attacker'
	grid.addChild(square);

	square = new createjs.Text('Deals', '40pt sans-serif', 'white');
	square.x = 420;
	square.y = 280;
	square.alpha = 1;
	grid.addChild(square);

	square = new createjs.Text('12 Damage!', '40pt sans-serif', 'white');
	square.x = 350;
	square.y = 360;
	square.alpha = 1;
	square.name = 'damageDealt'
	grid.addChild(square);
	
	//player 1 unit name
	square = new createjs.Text('Blue Archer', '25pt sans-serif', 'white');
	square.x = 50;
	square.y = 20;
	square.alpha = 1;
	square.name = 'p1name';
	grid.addChild(square);
	
	square = new createjs.Text('42 HP', '25pt sans-serif', 'white');
	square.x = 250;
	square.y = 20;
	square.alpha = 1;
	square.name = 'p1hp';
	grid.addChild(square);
	
	//player 2 unit name
	square = new createjs.Text('Red Archer', '25pt sans-serif', 'white');
	square.x = 670;
	square.y = 20;
	square.alpha = 1;
	square.name = 'p2name';
	grid.addChild(square);
	
	square = new createjs.Text('42 HP', '25pt sans-serif', 'white');
	square.x = 870;
	square.y = 20;
	square.alpha = 1;
	square.name = 'p2hp';
	grid.addChild(square);

	//player 1 stats
	square = new createjs.Text('+ 4 Power', '30pt sans-serif', 'white');
	square.x = 40;
	square.y = 580;
	square.alpha = 1;
	square.name = 'p1stats';
	grid.addChild(square);
	
	//player 2 stats
	square = new createjs.Text('+ 4 Power', '30pt sans-serif', 'white');
	square.x = 670;
	square.y = 580;
	square.alpha = 1;
	square.name = 'p2stats';
	grid.addChild(square);
	
	square = new createjs.Shape();
	square.graphics.beginFill('888888').rect(0,0,300,75);
	square.x = 335;
	square.y = 490;
	square.alpha = 1;
	square.addEventListener('click', bl.onFightClick);
	grid.addChild(square);

	square = new createjs.Text('Roll', '40pt sans-serif', 'white');
	square.x = 435;
	square.y = 500;
	square.alpha = 1;
	square.name = 'button';
	square.addEventListener('click', bl.onFightClick);
	grid.addChild(square);

	stage.update();
}

function doneLoading()
{
	// start the music
    createjs.Sound.play("mainGameMusic", createjs.Sound.INTERRUPT_NONE, 0, 10000, 0, 0.1, 0);
}

function setFightDice(p2d1,p2d2,p1d1,p1d2,firstRun)
{
	var grid = window.maze.fightpage;
	var square;
	
	if (!firstRun)
	{
		grid.removeChildAt(3,4,5,6);
	}
	
	var dieY = 480;
	var dieXsep = 80;
	var diep1X = 30;
	var diep2X = 790;
	
	//player 1 dice
	square = p1d1;
	square.x = diep1X;
	square.y = dieY;
	square.scaleX = 0.5;
	square.scaleY = 0.5;
	square.alpha = 1;
	grid.addChildAt(square, 3);

	square = p1d2;
	square.x = diep1X + dieXsep;
	square.y = dieY;
	square.scaleX = 0.5;
	square.scaleY = 0.5;
	square.alpha = 1;
	grid.addChildAt(square, 3);
	
	//player 2 dice
	square = p2d1;
	square.x = diep2X;
	square.y = dieY;
	square.scaleX = 0.5;
	square.scaleY = 0.5;
	square.alpha = 1;
	grid.addChildAt(square, 3);

	square = p2d2;
	square.x = diep2X + dieXsep;
	square.y = dieY;
	square.scaleX = 0.5;
	square.scaleY = 0.5;
	square.alpha = 1;
	grid.addChildAt(square, 3);
}
