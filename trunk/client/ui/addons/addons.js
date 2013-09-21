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
		html += '<table><tr><th>Name</th><th>State</th><th>Enabled</th></tr>';
		for (var i = 0; i < loaded.length; i++) {
			var addon = loaded[i], interface = addon.interface,
				unloaded = addon.readyState == undefined,
				state = unloaded ? "DISABLED" : states[addon.readyState],
				checked = !unloaded,
				stoppable = (interface && interface.stop) || unloaded;
			html += '<tr>'
					+ '<td>'+addon.name+'</td>'
					+ '<td>'+state+'</td>'
					+ '<td><input type="checkbox"'
						+ (checked ? ' checked' : '')
						+ (stoppable ? ' i="'+i+'"' : ' disabled') + '>'
						+ '</td>'
					+ '</tr>';
		}
		html += '</table>';
		addons.content.html(html);
		addons.content.find('input').on('change', function(event) {
			var i = event.target.getAttribute("i");
			if (i) {
				var addon = loaded[i];
				if (addon.readyState == undefined) {
					UI.require([ addon.name ]);
				} else {
					UI.unload(addon.name);
				}
				setTimeout(function() { load(); }, 100);
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
