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

	media.init();
	board.init();
	dudes.init();
	totems.init();
	dice.init();
	fight.init();

	stage.update();
}

