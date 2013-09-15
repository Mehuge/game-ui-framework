"use strict";
UI.define([ ], function() {

	var storage = localStorage,
		domain = "com.google.code.game-ui-framework",
		key = domain + '.state',
		state;

	try {
		state = JSON.parse(storage.getItem(key));
	} catch(e) {
		// no-op
	}

	function saveState() {
		storage.setItem(domain+'.state', JSON.stringify(state));
	}

	if (!state) {
		state = { 
			nick: "Player_"+((Math.random()*100)|0)
		};
		saveState();
	}

	var exports = {

		nick: function(n) {
			if (n) {
				state.nick = n;
				saveState();
				UI.pub("PLAYER_NICK_CHANGED", n);
			}
			return state.nick;
		},

		get: function(n,d) {
			var v = state[n];
			return v ? v : d;
		},

		set: function(n,v) {
			state[n] = v;
			UI.pub("STATE_CHANGED", { name: n, value: v });
			saveState();
		}

	};

	return exports;
});
