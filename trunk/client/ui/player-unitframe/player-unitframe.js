"use strict";
UI.define([
	'std',
	'state',
	'chatbox',
	'text!./style.css',
	'text!./unitframe.html'
], function(std, state, chatbox, css, html) {

	UI.css(css);
	var pUF = UI.html(html);

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
		},
		getHealth: function() { return health.value; },
		setHealth: function(pct) {
			health.value = pct;
			health.node.width((health.width*pct/100)|0);
		},
		getEndurance: function() { return endurance.value; },
		setEndurance: function(pct) {
			endurance.value = pct;
			endurance.node.width((endurance.width*pct/100)|0);
		},
		getMana: function() { return mana.value; },
		setMana: function(pct) {
			mana.value = pct;
			mana.node.width((mana.width*pct/100)|0);
		},
		getTargetHealth: function() { return tHealth.value; },
		setTargetHealth: function(pct) {
			tHealth.value = pct;
			tHealth.node.width((tHealth.width*pct/100)|0);
		},
		getXP: function() { return xp.value; },
		setXP: function(pct) {
			xp.value = pct;
			var bw = ((pct/10)|0)*10, ba = (pct-bw)*10;
			xp.bubs.width((xp.bubsWidth*bw/100)|0);
			xp.bar.width((xp.barWidth*ba/100)|0);
		},
		setName: function(nick) {
			name.node.text(nick);
		},
		setTargetName: function(name) {
			target.node.text(name);
		}
	}

	pUF.draggable({distance:0,handle:handle,containment:'window'});				// make chatbox draggable

	// Due to a circular dependance on chatbox and playerframe, we
	// have to give the chatbox chance to load 
	chatbox.system('daoc style player unit frame loaded');
	exports.setName(state.nick());

	// Register for player nickname changes, and update player nick
	// in player frame
	std.sub("PLAYER_NICK_CHANGED", function(nick) {
		exports.setName(nick);
	});

	// Return the public interface
	return UI.PlayerFrame = exports;
});

