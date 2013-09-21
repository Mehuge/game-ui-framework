UI.define(['_keyboard','_window','text!./style.css','text!./content.html'],function(keyboard,window,css,html){
	UI.css(css);
	var addons = window.create({
			id: 'addons', html: html, 
			hasChrome: true, 
			hasBorder: true,
			draggable: { cancel: '#addons>div' }
	});
	function load() {
		var loaded = UI.addons(), html = '', 
			states = [ "LOADING", "INITIALISED", "DEFINED", "STARTED" ];
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
