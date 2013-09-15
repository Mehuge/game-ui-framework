"use strict";
UI.define([ ], function() {

	var storage = localStorage,
		domain = "com.google.code.game-ui-framework",
		key = domain + '.state',
		state;			// internal version of the state object (the actual state)

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

	var exports = {		// external version of the stat object (the public interface)

		get: function(n,d) {
			var v = state[n];
			return v ? v : d;
		},

		set: function(n,v) {
			state[n] = v;
			UI.pub("STATE_CHANGED", { name: n, value: v });
			saveState();
		},

		unset: function(n) {
			delete state[n];
			saveState();
		}

	};

	// state.nick: Setup getter/setter
	exports.__defineGetter__("nick", function() { return state.nick; });
	exports.__defineSetter__("nick", function(v) { 
		state.nick = v;
		saveState();
		UI.pub("PLAYER_NICK_CHANGED", v);
	});

	return UI.state = exports;
});
