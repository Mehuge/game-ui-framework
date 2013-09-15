UI.define(['state','_window','text!./bar.css','text!./bar.html' ], function(state, window, css, html) {
	UI.css(css);
	function init() {
		var bottom = 5;
		for (var bar = 0; bar < 3; bar++) {
			var id = 'action-bar-'+bar, 
				w = window.create({ 
					id: id,
					className: 'action-bar', 
					draggable: true,
					html: html
				});
			w.css(state.get(id+'-position', { left: '40%', bottom: bottom+'px' }));
			if (bar>0) {
				var l = bar == 1 ? 'S' : 'C';
				w.content.children().each(function(i,n) {
					n.textContent = l+' '+n.textContent;
				});
			}
			w.show();
			w.on("dragstop", function(event, ui) {
				var bar = $(event.target), id = bar[0].id;
				state.set(id+'-position',UI.anchor(bar,ui.position));
			});
			bottom += w.height() + 13;
		}
	}
	return {
		run: function() {
			init();
		}
	};
});
