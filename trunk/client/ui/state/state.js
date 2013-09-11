"use strict";
UI.define([ 'std' ], function(std) {
	var _nick = "Player_"+((Math.random()*100)|0);
	var exports = {
		"chat-box": [5,5],						// position relative to bottom left
		"player-frame": [5, 5],					// position relative to bottom right
		nick: function(n) {
			if (n) {
				_nick = n;
				std.pub("PLAYER_NICK_CHANGED", _nick);
			}
			return _nick;
		}
	};
	return exports;
});
