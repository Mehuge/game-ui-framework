"use strict";
UI.define([ 'state', 'chatbox' ], function(state, chatbox) {
	chatbox.handler('/', function(text) {
		var s = text.split(" ");
		switch (s[0].toLowerCase()) {
		case "nick":
			if (s.length > 1) state.nick = s[1];
			return true;
		case "reloadui":
			location.reload();
			return true;
		case "youtube": case "yt":
			UI.require([ 'youtube' ], function(youtube) {
				if (s.length > 1) {
					youtube.play(s[1]);
				} else {
					youtube.hide();
				}
			});
			return true;
		case "go":
			UI.require([ 'browser' ], function(browser) {
				if (s.length > 1) {
					browser.go(s[1]);
				} else {
					browser.hide();
				}
			});
			return true;
		case "addons":
			UI.require([ 'addons' ], function(addons) {
				addons.toggle();
			});
			return true;
		case "who":
			chatbox.who(function(a) {
				for (var i = 0; i < a.length; i++) {
					chatbox.println(a[i]);
				}
			});
			return true;
		}
	});
});
