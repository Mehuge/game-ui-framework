UI.define([ 'text!./embed.html', 'text!./embed.css' ], function(html, css) {
	UI.css(css);
	var frame = UI.html(html); 
	frame.draggable();
	return {};
});
