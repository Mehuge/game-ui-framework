UI.define(['_keyboard','_window','state','text!./style.css','text!./content.html'],function(keyboard,window,state,css,html){
	UI.css(css);
	var addons = window.create({
			id: 'addons', html: html, 
			hasChrome: true, 
			hasBorder: true,
			draggable: { cancel: '#addons>div' }
	});

	// Restore any saved position
	addons.css(state.get('addons-position',{}));                      // {} allows CSS to provide the default position

	// Save window position if moved.
	addons.on("dragstop", function(event,ui) {
		state.set('addons-position', UI.anchor(addons, ui.position));
	});

	function load() {
		var loaded = UI.addons(), html = '', 
			states = [ "LOADING", "LOADED", "AVAILABLE", "STARTED" ];
		html += '<table><thead><tr><th></th><th>Name</th><th>State</th></tr></thead><tbody>';
		for (var i = 0; i < loaded.length; i++) {
			var addon = loaded[i], interface = addon.interface,
				unloaded = addon.readyState == undefined,
				state = unloaded ? "DISABLED" : states[addon.readyState],
				checked = !unloaded,
				stoppable = (interface && interface.stop && addon.dependants == 0) || unloaded;
			html += '<tr>'
					+ '<td><input type="checkbox"'
						+ (checked ? ' checked' : '')
						+ (stoppable ? ' i="'+i+'"' : ' disabled') + '>'
						+ '</td>'
					+ '<td>'+addon.name+'</td>'
					+ '<td>'+state+'</td>'
					+ '</tr>';
		}
		html += '</tbody></table>';
		addons.content.html(html);
		addons.content.find('input').on('change', function(event) {
			var i = event.target.getAttribute("i");
			if (i) {
				var addon = loaded[i];
				if (addon.readyState == undefined) {
					UI.require([ addon.name ], load);
				} else {
					if (UI.unload(addon.name)) {
						load();
					} else {
						this.checked = true;		// can't be unloaded
					}
				}
			}
		});
	};
	var exports = {
		run: function() { },					// start is a no-op
		toggle: function() {
			if (addons[0].style.display == 'block') {
				addons.hide();
			} else {
				load();
				addons.show();
			}
		}
	};
	return exports;
});
