"use strict";
UI.define([
	'state',
	'chatbox',
	'text!./style.css',
	'text!./unitframe.html'
], function(state, chatbox, css, html) {

	UI.css(css);
	var pUF = UI.html(html);

	pUF.css(state.get('player-unitframe-position', {}));			// {} use CSS as default position
	pUF.on("dragstop", function(event, ui) {
		state.set('player-unitframe-position', UI.anchor(pUF, ui.position));
	});

	// Private data
	var health = { node: pUF.children('#p-health'), value: 100 },
		endurance = { node: pUF.children('#p-endurance'), value: 100 },
		mana = { node: pUF.children('#p-mana'), value: 100 },
		tHealth = { node: pUF.children('#t-health'), value: 100 },
		xp = { bubs: pUF.children('#p-bubs'), bar: pUF.children('#p-bar'), value: 0 },
		name = { node: pUF.children('#p-name'), value: '' },
		target = { node: pUF.children('#t-name'), value: '' },
		handle = pUF.children('#draghandle');

	// Initialise widths
	health.width = health.node.width();
	endurance.width = endurance.node.width();
	mana.width = mana.node.width();
	tHealth.width = tHealth.node.width();
	xp.bubsWidth = xp.bubs.width();
	xp.barWidth = xp.bar.width();

	function setHealth(pct) {
		health.node.width((health.width*pct/100)|0);
	};
	function setEndurance(pct) {
		endurance.node.width((endurance.width*pct/100)|0);
	};
	function setMana(pct) {
		mana.node.width((mana.width*pct/100)|0);
	};
	function setTargetHealth(pct) {
		tHealth.node.width((tHealth.width*pct/100)|0);
	};
	function setXP(pct) {
		xp.value = pct;
		var bw = ((pct/10)|0)*10, ba = (pct-bw)*10;
		xp.bubs.width((xp.bubsWidth*bw/100)|0);
		xp.bar.width((xp.barWidth*ba/100)|0);
	};
	function setName(nick) {
		name.node.text(nick);
	};
	function setTargetName(name) {
		target.node.text(name);
	};

	// Public interface
	var exports = {
		run: function() {
			this.show();
		},
		show: function() {
			pUF.css({ display: 'block' });
		},
		hide: function() {
			pUF.css({ display: 'none' });
		}
	}

	pUF.draggable({distance:0,handle:handle,containment:'window'});				// make chatbox draggable

	// Due to a circular dependance on chatbox and playerframe, we
	// have to give the chatbox chance to load 
	chatbox.system('daoc style player unit frame loaded');

	// Subscribe to the game tick topic, is called whenever updated game information
	// is available, we update our player frame with the latest info
	UI.sub("GAME_TICK", function(cuAPI) {
		setHealth((cuAPI.hp*100/cuAPI.maxHP)|0);
		setEndurance((cuAPI.endurance*100/cuAPI.maxEndurance)|0);
		setMana((cuAPI.mana*100/cuAPI.maxMana)|0);
		setTargetHealth((cuAPI.targetHP*100/cuAPI.maxTargetHP)|0);
		setTargetName(cuAPI.targetName);
		setName(cuAPI.name);
		setXP(cuAPI.xp*100/cuAPI.maxXP);
	});

	// Return the public interface
	return UI.PlayerFrame = exports;
});

