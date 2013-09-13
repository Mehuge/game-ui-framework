UI.define([ 'std' ], function() {
	var console = UI.window.console,		// The real browser console.
		watchers = [],						// things watching the console
		useConsole = true;					// allow log messages to go to browser console
	function out(level, arguments) {
		for (var i = 0; i < watchers.length; i++) {
			if (watchers[i].apply(this, [ level ].concat(arguments))) {
				return true;
			}
		}
		if (useConsole) {
			switch(level) {
			case "log": console.log(m); break;
			}
		}
	};
	return UI.log = {
		log: function(m) { out("log", m); },
		capture: function(watcher) { return watchers.push(watcher); },
		stopCapture: function(watcher) { delete watchers[watcher]; }
	};
});
