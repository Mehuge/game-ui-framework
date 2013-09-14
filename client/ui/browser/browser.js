UI.define([ 'chatbox', 'text!./embed.html', 'text!./embed.css' ], function(chatbox, html, css) {
	UI.css(css);
	var frame = UI.html(html), iframe = frame.children();
	frame.draggable();
	return { 
		go: function(url) {
			chatbox.println('Loading URL ' + url, { color: "yellow" });
			iframe[0].src = url;
			this.show();
		},
		show: function() {
			frame.css({display:"block"});
		},
		hide: function() {
			frame.css({display:"none"});
		}
	};
});
