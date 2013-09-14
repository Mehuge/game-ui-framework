UI.define(['text!./_window.css','text!./_window.html'],function(css,html){
	UI.css(css);
	var exports = {
		create: function(id) {
			var w = UI.html(html,{id:id});
			w.content = w.children('div');
			return w;
		}
	};
	return exports;
});
