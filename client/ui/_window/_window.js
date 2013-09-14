UI.define(['text!./_window.css','text!./_window.html'],function(css,html){
	UI.css(css);			// standard window CSS
	var exports = {
		create: function(options) {
			var w = UI.html(html,{id:options.id});
			w.content = w.children('div');	// child element is where content goes
			if (options.hasChrome) w.addClass('ui-has-chrome');
			if (options.hasBorder) w.addClass('ui-has-border');
			if (options.html) w.content.html(options.html);
			if (options.className) w.addClass(options.className);
			if (options.css) w.css(options.css);
			if (options.draggable) {
				var draggable = { containment: 'window', refreshPositions: true, stack: '.ui-w' };
				if (typeof options.draggable == "object") UI.mixin(draggable, options.draggable);
				w.draggable(draggable);
			}
			return w;
		}
	};
	return exports;
});
