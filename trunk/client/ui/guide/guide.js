// This is an example of an unloadable component.  
//	
//	It defines a stop method, which tells the UI framework this module can be stopped (unloaded).
//
//	Note that, a module that is stoppable, should not be specified as a dependency of another module.  Need to add some
//	way to signal that. 
//
UI.define(['_keyboard','_window','state','text!./guide.css','text!./guide.html'],function(keyboard,window,state,css,html){

	var css = UI.css(css),								// add CSS
		guide = window.create({							// and create guide window
			id: 'guide', html: html, 
			hasChrome: true, 
			hasBorder: true,
			draggable: { cancel: '#guide>div' }
		}),
		keypress;										// keypress handler

	// Restore any saved position
	guide.css(state.get('guide-position',{}));			// {} allows CSS to provide the default position

	// Save guide position if moved.
	guide.on("dragstop", function(event,ui) {
		state.set('guide-position', UI.anchor(guide, ui.position));
	});

	// Initialise the guide window
	function init() {
		// Register for the I keypress and respond to it by
		// toggling the guide window (hide/show).
		keypress = keyboard.onkey(105,function(event) {
			if (guide[0].style.display == 'block') {
				exports.hide();
			} else {
				exports.show();
			}
			return true;
		});
	}

	// Allow the guide module to be unloaded
	function stop() {
		guide.off("dragstop");			// stop listening for move events
		keyboard.remove(keypress);		// unregister keyboard handler
		guide.remove();					// Remove guide HTML
		css.remove();					// Remove guide CSS
	}

	// Show the guide window
	function show() {
		guide.css({display:'block'});
	}

	// Hide the guide window
	function hide() {
		guide.css({display:'none'});
	}

	// Define our public interface
	var exports = {
		run: init,
		stop: stop,
		show: show,
		hide: hide
	};

	// Show the guide window immediately
	exports.show();

	// Return our public interface
	return exports;
});
