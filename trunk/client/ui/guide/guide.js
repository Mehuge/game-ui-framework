UI.define(['_keyboard','text!./guide.css','text!./guide.html'],function(keyboard,css,html){
	UI.css(css);
	var guide = UI.html(html);
	guide.draggable();
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
