UI.define(['text!./_window.css','text!./_window.html'],function(css,html){
	UI.css(css);			// standard window CSS
	var exports = {
		create: function(id) {
			var w = UI.html(html,{id:id});
			w.content = w.children('div');	// child element is where content goes
			return w;
		}
	};
	return exports;
});
