UI.define(['text!./_window.css','text!./_window.html'],function(css,html){
	UI.css(css);			// standard window CSS
	var exports = {
		create: function(id,innerHTML) {
			var w = UI.html(html,{id:id});
			w.content = w.children('div');	// child element is where content goes
			if (innerHTML) w.content.html(innerHTML);
			return w;
		}
	};
	return exports;
});
