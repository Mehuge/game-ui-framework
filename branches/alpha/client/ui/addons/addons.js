UI.define(['_keyboard','_window','text!./style.css','text!./content.html'],function(keyboard,window,css,html){
	UI.css(css);
	var addons = window.create({
			id: 'addons', html: html, 
			hasChrome: true, 
			hasBorder: true,
			draggable: { cancel: '#addons>div' }
	});
	function load() {
		var loaded = UI.addons(), html = '', states = [ "LOADING", "INITIALISED", "DEFINED", "STARTED" ];
		html += '<table><tr><th>Name</th><th>State</th></tr>';
		for (var i = 0; i < loaded.length; i++) {
			var addon = loaded[i];
			html += '<tr>'
					+ '<td>'+addon.name+'</td>'
					+ '<td>'+states[addon.readyState]+'</td>'
					+ '</tr>';
		}
		html += '</table>';
		addons.content.html(html);
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
