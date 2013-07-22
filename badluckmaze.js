window.bl = new Object();
window.blassets = new Object();

window.maze = new Object();
window.maze.SQHEIGHT = 64;
window.maze.SQWIDTH = 109;
window.maze.BOARDSIZE = 13;
window.maze.VOFFSET = 110;
window.maze.HOFFSET = 960;

function init() {
	var scaleW, scaleH, scale;
	stage = new createjs.Stage("myCanvas");

	media.init();
	board.init();
	dudes.init();
	totems.init();
	dice.init();
	fight.init();

	scaleW = window.innerWidth / stage.canvas.width;
	scaleH = window.innerHeight / stage.canvas.height;
	scale = Math.min(scaleW, scaleH);
	stage.scaleX = scale;
	stage.scaleY = scale;

	stage.update();
}

