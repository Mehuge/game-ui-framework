"use strict";
UI.define([ 'state', 'chatbox' ], function(state, chatbox) {
	chatbox.handler('/', function(text) {
		var s = text.split(" ");
		switch (s[0].toLowerCase()) {
		case "nick":
			if (s.length > 1) state.nick(s[1]);
			return true;
		case "reloadui":
			location.reload();
			return true;
		}
	});
});
