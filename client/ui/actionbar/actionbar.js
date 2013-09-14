UI.define(['_window','text!./bar.css','text!./bar.html' ], function(window, css, html) {
	UI.css(css);
	var bottom = 5;
	for (var bar = 0; bar < 3; bar++) {
		var w = window.create('ab'+bar,html);
		w.addClass('action-bar');
		w.draggable({containment:'window'});
		w.css({left:'40%',bottom: bottom+'px'});
		if (bar>0) {
			var l = bar == 1 ? 'S' : 'C';
			w.content.children().each(function(i,n) {
				n.textContent = l+'-'+n.textContent;
			});
		}
		w.show();
		bottom += w.height() + 13;
	}
	return {
	};
});
