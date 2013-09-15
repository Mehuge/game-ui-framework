UI.define(['_keyboard','_window','text!./guide.css','text!./guide.html'],function(keyboard,window,css,html){
	UI.css(css);
	var guide = window.create({
			id: 'guide', html: html, 
			hasChrome: true, 
			hasBorder: true,
			draggable: { cancel: '#guide>div' }
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
	var exports = {
		run: function() { init(); },
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