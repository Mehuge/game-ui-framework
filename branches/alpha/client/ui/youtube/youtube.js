UI.define([ 'chatbox', 'text!./embed.html', 'text!./embed.css' ], function(chatbox, html, css) {
	UI.css(css);
	var frame = UI.html(html), iframe = frame.children();
	frame.draggable({ constrain: 'window' });
	return { 
		play: function(video) {
			chatbox.println('Playing video ' + video, { color: "yellow" });
			iframe[0].src = "//www.youtube.com/embed/"+video+"?controls=0&rel=0&showinfo=0";
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
