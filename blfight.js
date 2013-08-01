fight = new Object();
fightPriv = new Object();

//////////////////////////////////////////////////////////////////////////// 
/////////////////////////// -- PUBLIC MUTATORS -- //////////////////////////
//////////////////////////////////////////////////////////////////////////// 

fight.begin = function(attacker, defender) {
	fightPriv.attacker = attacker;
	fightPriv.defender = defender;

	fightPriv.offense_roll = 0;
	fightPriv.defense_roll = 0;
	fightPriv.damage = 0;

	fightPriv.set_info();
	fightPriv.display.visible = 1;
}

//////////////////////////////////////////////////////////////////////////// 
////////////////////////// -- PRIVATE FUNCTIONS -- /////////////////////////
//////////////////////////////////////////////////////////////////////////// 

fightPriv.attack = function() {
	var offense, defense, damage, attacker, defender;
	attacker = fightPriv.attacker;
	defender = fightPriv.defender;

	dice.roll_dice(attacker.owner);
	offense = dice.get_result_val(attacker.owner);

	dice.roll_dice(defender.owner);
	defense = dice.get_result_val(defender.owner);

	damage = offense + attacker.power - defense;
	damage = Math.max(damage, 0);

	fightPriv.offense_roll = offense;
	fightPriv.defense_roll = defense;
	fightPriv.damage  = damage;

	fightPriv.set_info();
}

fightPriv.set_info = function() {
	fightPriv.set_attacker_info();
	fightPriv.set_defender_info();

	fightPriv.results_info.attack.text = fightPriv.offense_roll;
	fightPriv.results_info.power.text = fightPriv.attacker.power;
	fightPriv.results_info.defense.text = fightPriv.defense_roll;
	fightPriv.results_info.damage.text = fightPriv.damage;
}

fightPriv.set_attacker_info = function() {
	var dude = fightPriv.attacker;
	var info = fightPriv.attacker_info;

	fightPriv.set_dude_info(info, dude);
	info.stat.text = 'Power +' + dude.power;
}

fightPriv.set_defender_info = function() {
	var dude = fightPriv.defender;
	var info = fightPriv.defender_info;

	fightPriv.set_dude_info(info, dude);
	info.stat.text = 'Health ' + dude.health;
}

fightPriv.set_dude_info = function(info, dude) {
	info.portrait.removeAllChildren();
	info.portrait.addChild(dude.portrait);

	info.title.text = fightPriv.player_map[dude.owner] + dude.type;

	for(i in info.dice) {
		info.dice[i].removeAllChildren();
		info.dice[i].addChild(dice.get_result_img(dude.owner, i));
	}
}

fightPriv.onClick = function(click) {
	if(fightPriv.roll.visible) {
		fightPriv.attack();
		fightPriv.roll.visible = 0;
		fightPriv.done.visible = 1;
		stage.update();
	} else if(fightPriv.done.visible) {
		fightPriv.display.visible = 0;
		fightPriv.roll.visible = 1;
		fightPriv.done.visible = 0;
		game.fight_end(fightPriv.attacker, fightPriv.defender, fightPriv.damage);
	}
}

//////////////////////////////////////////////////////////////////////////// 
//////////////////////// -- PRIVATE DISPLAY TREE -- //////////////////////// 
//////////////////////////////////////////////////////////////////////////// 

fightPriv.newButton = function() {
	var item, items = new Array();
	var container = new createjs.Container();
	container.name = 'Roll';

	item = fightPriv.newText('Roll', 50);
	item.w = item.getMeasuredWidth();
	item.h = item.getMeasuredHeight();
	item.align = 'center';
	items.push(item);
	fightPriv.roll = item;

	item = fightPriv.newText('Done', 50);
	item.w = item.getMeasuredWidth();
	item.h = item.getMeasuredHeight();
	item.align = 'center';
	item.visible = 0;
	items.push(item);
	fightPriv.done = item;

	display.stack(container, items, 10);

	// Background
	item = new createjs.Shape();
	item.graphics.f('AA0000').rr(0, 0, container.w, container.h, 12);
	container.addChildAt(item, 0);
	container.hitArea = item;
	container.addEventListener('click', fightPriv.onClick);

	return container;
}

fightPriv.newResults = function() {
	var item, items = new Array();
	var column, columns = new Array();
	var container = new createjs.Container();
	container.name = 'Results';

	item = fightPriv.newText('Attack:', 20);
	item.w = item.getMeasuredWidth();
	item.h = item.getMeasuredHeight();
	items.push(item);

	item = fightPriv.newText('Power:', 20);
	item.w = item.getMeasuredWidth();
	item.h = item.getMeasuredHeight();
	items.push(item);

	item = fightPriv.newText('Defense:', 20);
	item.w = item.getMeasuredWidth();
	item.h = item.getMeasuredHeight();
	items.push(item);

	item = fightPriv.newText('Damage:', 20);
	item.w = item.getMeasuredWidth();
	item.h = item.getMeasuredHeight();
	items.push(item);

	column = new createjs.Container();
	display.vertical(column, items, 5, 0);
	columns.push(column);
	items.length = 0;

	item = fightPriv.newText('', 20);
	item.w = item.getMeasuredWidth();
	item.h = item.getMeasuredHeight();
	items.push(item);

	item = fightPriv.newText('+', 20);
	item.w = item.getMeasuredWidth();
	item.h = item.getMeasuredHeight();
	item.align = 'center';
	items.push(item);

	item = fightPriv.newText('-', 20);
	item.w = item.getMeasuredWidth();
	item.h = item.getMeasuredHeight();
	item.align = 'center';
	items.push(item);

	item = fightPriv.newText('=', 20);
	item.w = item.getMeasuredWidth();
	item.h = item.getMeasuredHeight();
	item.align = 'center';
	items.push(item);

	column = new createjs.Container();
	display.vertical(column, items, 5, 0);
	columns.push(column);
	items.length = 0;

	item = fightPriv.newText('##', 20);
	item.w = item.getMeasuredWidth();
	item.h = item.getMeasuredHeight();
	items.push(item);
	fightPriv.results_info.attack = item;

	item = fightPriv.newText('##', 20);
	item.w = item.getMeasuredWidth();
	item.h = item.getMeasuredHeight();
	items.push(item);
	fightPriv.results_info.power = item;

	item = fightPriv.newText('##', 20);
	item.w = item.getMeasuredWidth();
	item.h = item.getMeasuredHeight();
	items.push(item);
	fightPriv.results_info.defense = item;

	item = fightPriv.newText('##', 20);
	item.w = item.getMeasuredWidth();
	item.h = item.getMeasuredHeight();
	items.push(item);
	fightPriv.results_info.damage = item;

	column = new createjs.Container();
	display.vertical(column, items, 5, 0);
	columns.push(column);

	display.horizontal(container, columns, 5, 0);

	return container;
}

fightPriv.newVs = function() {
	var item, items = new Array();
	var container = new createjs.Container();
	container.name = 'Vs';

	item = fightPriv.newText('VS', 50);
	item.w = item.getMeasuredWidth();
	item.h = item.getMeasuredHeight();
	item.align = 'center';
	items.push(item);

	item = new display.createSpacer(0, 50);
	items.push(item);
	
	item = fightPriv.newResults();
	item.align = 'center';
	items.push(item);
	
	item = new display.createSpacer(0, 200);
	items.push(item);
	
	item = fightPriv.newButton();
	item.align = 'center';
	items.push(item);
	
	display.vertical(container, items, 10, 0);

	return container;
}

fightPriv.newStats = function(info) {
	var item, items = new Array();
	var container = new createjs.Container();
	container.name = 'Stats';

	item = fightPriv.newText('== TITLE ==', 30);
	item.w = item.getMeasuredWidth();
	item.h = item.getMeasuredHeight();
	items.push(item);
	info.title = item;

	item = fightPriv.newText('== STAT ==', 30);
	item.w = item.getMeasuredWidth();
	item.h = item.getMeasuredHeight();
	items.push(item);
	info.stat = item;

	display.vertical(container, items, 5, 0);

	return container;
}

fightPriv.newDice = function(info) {
	var container = new createjs.Container();
	var item, items = new Array();
	container.name = 'Dice';

	for(var i = 0; i < NUM_DICE_PER_PLAYER; i++) {
		item = new createjs.Container();
		item.name = 'Die ' + i;
		item.w = 65;
		item.h = 65;
		item.scaleX = 0.5;
		item.scaleY = 0.5;
		items.push(item);
		info.dice.push(item);
	}

	display.horizontal(container, items, 20, 0);

	return container;
}

fightPriv.newDude = function(info) {
	var item, items = new Array();
	var container = new createjs.Container();
	container.name = 'Dude Display';

	item = new createjs.Container();
	item.name = 'Portrait';
	item.align = 'center';
	item.w = 300;
	item.h = 400;
	items.push(item);
	info.portrait = item;

	item = fightPriv.newStats(info);
	item.align = 'center';
	items.push(item);

	item = fightPriv.newDice(info);
	item.align = 'center';
	items.push(item);

	display.vertical(container, items, 10, 0);

	return container;
}

fightPriv.newFightPage = function() {
	var info, item, items = new Array();
	var container = new createjs.Container();
	container.name = 'Fight Page';

	info = new fightPriv.createDudeInfo()
	item = fightPriv.newDude(info);
	items.push(item);
	fightPriv.attacker_info = info;

	item = fightPriv.newVs();
	item.align = 'push';
	items.push(item);

	info = new fightPriv.createDudeInfo()
	item = fightPriv.newDude(info);
	items.push(item);
	fightPriv.defender_info = info;

	display.horizontal(container, items, 10, 10);

	// Background
	item = new createjs.Shape();
	item.graphics.f('000000').rr(0, 0, container.w, container.h, 12);
	container.addChildAt(item, 0);

	return container;
}

fightPriv.newFightScreen = function() {
	var item, items = new Array();
	var container = new createjs.Container();
	container.name = 'Fight Screen';
	
	item = display.newModalCover();
	items.push(item);

	item = fightPriv.newFightPage();
	item.align = 'center';
	items.push(item);

	display.stack(container, items, 0);

	return container;
}

//////////////////////////////////////////////////////////////////////////// 
//////////////////////// -- PRIVATE CONSTRUCTORS -- //////////////////////// 
//////////////////////////////////////////////////////////////////////////// 

fightPriv.newText = function(text, size) {
	return new createjs.Text(text, size+'pt sans-serif', 'white');
}

fightPriv.createDudeInfo = function() {
	this.portrait = null;
	this.title = null;
	this.stat = null;
	this.dice = new Array();
}

fightPriv.createResultsInfo = function() {
	this.attack = null;
	this.power = null;
	this.defense = null;
	this.damage = null;
}

//////////////////////////////////////////////////////////////////////////// 
/////////////////////////// -- INITIALIZATION -- ///////////////////////////
//////////////////////////////////////////////////////////////////////////// 

fight.init = function() {
	fightPriv.offense_roll = 0;
	fightPriv.defense_roll = 0;
	fightPriv.damage = 0;
	fightPriv.attacker = null;
	fightPriv.attacker_info = null;
	fightPriv.defender = null;
	fightPriv.defender_info = null;
	fightPriv.results_info = new fightPriv.createResultsInfo();

	fightPriv.player_map = new Array();
	fightPriv.player_map[RED_PLAYER]  = 'Red ';
	fightPriv.player_map[BLUE_PLAYER] = 'Blue ';

	fightPriv.display = fightPriv.newFightScreen();
	stage.addChild(fightPriv.display);

	fightPriv.display.visible = 0;
}

