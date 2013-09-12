"use strict";
UI.define([ 'chatbox' ], function(chatbox) {
	chatbox.handler('/', function(text) {
		var s = text.split(" ");
		switch (s[0].toLowerCase()) {
		case "logout":
			chatbox.system('You will be logged out in 30 seconds. (not really)');
			return true;
		}
	});
});
