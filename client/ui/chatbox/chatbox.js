"use strict";
UI.define([
	'_keyboard',					// ui/keyboard/keyboard.js
	'std',							// ui/std/std.js
	'state',						// ui/state/state.js
	'chat',							// ui/chat/chat.js
	'text!./style.css',				// ./style.css
	'text!./chatbox.html',			// ./chatbox.html
], function(keyboard, std, state, chat, css, html) {

	var style = UI.css(css),
		chatBox = UI.html(html),
		tabsArea = chatBox.children('#tabs'),
		msgArea = chatBox.children('#messages'),
		inputArea = chatBox.children('#input'),
		input = inputArea.children('input'),
		tabs = tabsArea.children(),
		msgs = msgArea.children(),
		currentTab = undefined,
		handlers = [];

	chatBox.css(state.get('chatbox-position', { left: '5px', bottom: '5px' }));

	// Public interface
	var exports = {
		run: function() {
			this.show();
		},
		show: function() {
			chatBox.css({ display: 'block' });
		},
		hide: function() {
			chatBox.css({ display: 'none' });
		},
		select: function(index) {
			currentTab = index;
			for (var i = 0; i < tabs.length; i++) {
				var m = i == index ? "addClass" : "removeClass";
				var s = "selected";
				($(tabs[i])[m])(s);
				($(msgs[i])[m])(s);
			}
		},
		println: function(m) {
			var div = document.createElement('div');
			div.innerHTML = m;
			var t = $(msgs[currentTab]);
			t.append(div);
			msgArea.scrollTop(t.height() - msgArea.height());
		},
		handler: function(prefix, handler) {
			handlers.push({ prefix: prefix, handler: handler });
		},
		system: function(m) {
			this.println('<span class="system">' + m + '</span>');
		},
		who: function(f) {
			channel.who(function(a) { f(a); });
		}
	}

	// Tab title clicked
	function tabClick(e) {
		exports.select(e.target.index);
		e.preventDefault();
	}

	// Command processor
	function process_command(s) {
		for (var i = 0; i < handlers.length; i++) {
			var prefix = handlers[i].prefix;
			if (s.substr(0,prefix.length) === prefix) {
				if (handlers[i].handler(s.substr(prefix.length))) return true;
			}
		}
	}

	// keyboard press in chat box
	function keyDown(e) {
		if (e.keyCode == 13 && e.target.value.length) {
			if (!process_command(e.target.value)) {
				channel.chat(e.target.value);
			}
			e.target.value = '';
			e.preventDefault();
		}
		e.stopPropagation();
		return true;
	}

	// message received from chat server
	function onmessage(m) {
		var cls = 'message';
		if (m.score > 100) cls += ' spam';
		if (m.spamCount > 10) cls += ' muted';
		exports.println(std.pad(m.time.getHours(),2)+':'+std.pad(m.time.getMinutes(),2)
				+' <span class="nick">'+m.nick+'</span>: <span class="'+cls+'">' + m.message + '</span>');
	}

	// Initialise tab click handlers
	for (var i = 0; i < tabs.length; i++) {
		$(tabs[i]).on("click", tabClick);
		tabs[i].index = i;
	}

	// Attach onkeydown handler to input elemnt
	input.on('keydown', keyDown);
	// and stop global keypress handler getting fired for stuff typed into chat box
	input.on('keypress', function(e) { e.stopPropagation(); });
	input.on('mousedown', function(e) { input.focus(); });

	// Initialise chat window
	chatBox.draggable({ cancel: '#messages', containment: 'window' });				// make chatbox draggable
	exports.select(0);				// make sure general tab is selected
	input.focus();
	chatBox.on("dragstop", function(event, ui) {
		// re-position it to get correct anchroing, as drag always positions relative
		// to top left
		state.set('chatbox-position', UI.anchor(chatBox,ui.position));
	});

	// Connect to chat server
	var channel = chat.connect('general', state.nick, onmessage);

	// Subscribe to player nick name change events, and tell the chat server 
	// the new nickname if we get one
	UI.sub("PLAYER_NICK_CHANGED", function(nick) {
		channel.nick(nick);
	});

	// Register for some global keypresses
	keyboard.onkey(keyboard.RETURN, function() { input[0].focus(); return true; });							// RETURN
	keyboard.onkey(keyboard.SLASH, function() { input[0].value = '/'; input[0].focus(); return true; });		// Slash (/)

	// Return the public interface
	return UI.ChatBox = exports;
});
