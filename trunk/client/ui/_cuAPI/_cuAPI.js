// cuAPI Emulation
//	- Note, this is based loosely on what could be seen in @CSE_Tim's UI update video, and is
//    unlikely to be representative of the final API.  This is just an excercise on how this
//	  framework might go about emulating the API
UI.define([], function() {

	var player_health = 100, max_player_health = 100,
		player_mana = 50, max_player_mana = 50,
		player_endurance = 100, max_player_endurance = 100,
		player_xp = 0, max_player_xp = 100,
		target_health = 100, max_target_health = 100,
		target_name = 'Gog',
		player_name = '';

	var cuAPI = UI.window.cuAPI = UI.cuAPI = {
	};

	cuAPI.__defineGetter__("xp", function() { return player_xp; });
	cuAPI.__defineGetter__("maxXP", function() { return max_player_xp; });
	cuAPI.__defineGetter__("hp", function() { return player_health; });
	cuAPI.__defineGetter__("maxHP", function() { return max_player_health; });
	cuAPI.__defineGetter__("endurance", function() { return player_endurance; });
	cuAPI.__defineGetter__("maxEndurance", function() { return max_player_endurance; });
	cuAPI.__defineGetter__("mana", function() { return player_mana; });
	cuAPI.__defineGetter__("maxMana", function() { return max_player_mana; });
	cuAPI.__defineGetter__("targetHP", function() { return target_health; });
	cuAPI.__defineGetter__("maxTargetHP", function() { return max_target_health; });
	cuAPI.__defineGetter__("targetName", function() { return target_name; });
	cuAPI.__defineGetter__("name", function() { return name; });

	function emulate() {
		player_health = (Math.random()*max_player_health)|0;
		player_endurance = (Math.random()*max_player_endurance)|0;
		player_mana = (Math.random()*max_player_mana)|0;
		target_health = (Math.random()*max_target_health)|0;
		target_name = [ 'Gog', 'Ladonna', 'Hulbur' ][(Math.random()*3)|0];
		player_xp ++;
		if (player_xp > 100) player_xp = 0;
		UI.pub("GAME_TICK", cuAPI);
	};

	UI.sub("PLAYER_NICK_CHANGED", function(nick) {
		name = nick;
	});

	setInterval(emulate,1000);

	return cuAPI;
});
