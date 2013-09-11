"use strict";
UI.define([ "player-unitframe" ], function() {

	var timer = null;
	var F = UI.PlayerFrame;

	function simulation() {
		if (F) {
			var value = F.getHealth();
			F.setHealth(value <= 1 ? 100 : Math.max(0, value - ((Math.random()*50)|0)));

			value = F.getEndurance();
			F.setEndurance(value <= 1 ? 100 : Math.max(0, value - ((Math.random()*50)|0)));

			value = F.getMana();
			F.setMana(value <= 1 ? 100 : Math.max(0, value - ((Math.random()*50)|0)));

			value = F.getTargetHealth();
			F.setTargetHealth(value <= 1 ? 100 : Math.max(0, value - ((Math.random()*50)|0)));

			F.setTargetName([ 'Gog', 'Ladonna', 'Hulbur' ][(Math.random()*3)|0]);

			value = F.getXP() + 1;
			if (value > 100) value = 0;
			F.setXP(value);
		}

		timer = window.setTimeout(simulation, 1000);
	};

	var exports = {
		run: function() {
			this.start();
		},
		stop: function() {
			window.clearTimeout(timer);
		},
		start: function() {
			simulation();
		}
	};

	return exports;
});

