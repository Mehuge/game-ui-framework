UI.define(['_keyboard','_window','text!./guide.css','text!./guide.html'],function(keyboard,window,css,html){
	UI.css(css);
	var guide = window.create('guide',html);
	guide.draggable({containment:'window'});
	keyboard.onkey(105,function(event) {
		if (guide[0].style.display == 'block') {
			exports.hide();
		} else {
			exports.show();
		}
	});
	var exports = {
		show: function() {
			guide.css({display:'block'});
		},
		hide: function() {
			guide.css({display:'none'});
		}
	};
	exports.show();
	return exports;
});
