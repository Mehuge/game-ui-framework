UI.define([], function() {

	var kh = {};			// registered keypress handlers

	// global key down handler
	var lkd = $(UI.window.document).on("keypress", function(event) {
		var handlers = kh[event.keyCode];
		if (handlers) {
			for (var i = 0; i < handlers.length; i++) {
				if (typeof handlers[i].action == "function") {
					try {
						if (handlers[i].action(event)) {
							// if handler returns true, stop processing
							event.preventDefault();
							return true;
						}
					} catch(e) {
						// UI.log.error(e);
					}
				}
			}
		}
		console.log('unhandled key press ' + event.keyCode);
	});

	return UI.keyboard = {
		// Register a "keypress" handler for the specified key code, returns a handle to the
		// registration.
		onkey: function(key, action) {
			return (kh[key] = kh[key] || []).push({ key: key, action: action });
		},

		// var h = keyboard.onkey(99,handler); ... keyboard.remove(h);
		// Remove a previously registered handler.
		remove: function(h) {
			var handlers = kh[h.key];
			if (handlers) {
				delete handlers[h];
				if (handlers.length == 0) {
					delete kh[h.key];
				}
			}
		},

		RETURN: 13,
		SLASH: 47

	};
	
});
