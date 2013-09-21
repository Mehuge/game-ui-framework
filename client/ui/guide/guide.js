UI.define(['_keyboard','_window','state','text!./guide.css','text!./guide.html'],function(keyboard,window,state,css,html){
	var css = UI.css(css),
		guide = window.create({
			id: 'guide', html: html, 
			hasChrome: true, 
			hasBorder: true,
			draggable: { cancel: '#guide>div' }
	});
	guide.css(state.get('guide-position',{}));			// {} allows CSS to provide the default position
	guide.on("dragstop", function(event,ui) {
		state.set('guide-position', UI.anchor(guide, ui.position));
	});

	function init() {
		keyboard.onkey(105,function(event) {
			if (guide[0].style.display == 'block') {
				exports.hide();
			} else {
				exports.show();
			}
			return true;
		});
	}

	function stop() {
		guide.remove();
		css.remove();
	}

	function show() {
		guide.css({display:'block'});
	}

	function hide() {
		guide.css({display:'none'});
	}

	var exports = {
		run: init,
		stop: stop,
		show: show,
		hide: hide
	};
	exports.show();
	return exports;
});
