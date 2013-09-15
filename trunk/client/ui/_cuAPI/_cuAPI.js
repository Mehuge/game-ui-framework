// cuAPI Emulation
//	- Note, this is based loosely on what could be seen in @CSE_Tim's UI update video, and is
//    unlikely to be representative of the final API.  This is just an excercise on how this
//	  framework might go about emulating the API
UI.define([], function() {

	var player_health = 100, max_player_health = 100,
		player_mana = 50, max_player_mana = 50;

	var cuAPI = UI.window.cuAPI = UI.cuAPI = {
	};

	cuAPI.__defineGetter__("hp", function() { return player_health; });
	cuAPI.__defineGetter__("maxHP", function() { return max_player_health; });
	cuAPI.__defineGetter__("mana", function() { return player_mana; });
	cuAPI.__defineGetter__("maxMana", function() { return max_player_mana; });

	return cuAPI;
});
