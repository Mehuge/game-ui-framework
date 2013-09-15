"use strict";
UI.define([], function() {

	var WebSocket = window.WebSocket || window.MozWebSocket;
	var pending = {}, requestId = 0;

	var exports = {
		connect: function(channel, nick, onmessage) {
			var chat = new WebSocket("ws://locutus.sorcerer.co.uk:1337/"+channel+"?nick="+nick, "chat");

			chat.onopen = function() { 
				onmessage({
					time: new Date(), nick: "System", 
					message: 'Connected to ' + channel + ' channel on chat server. Use /nick to change your nickname'}
				);
			};

			chat.onerror = function(error) { console.dir(error); };

			chat.onmessage = function(message) {
				console.dir(message);
				try {
					var m = JSON.parse(message.data);
				} catch(e) {
					console.dir(e);
					console.log(message.data);
					return;
				}
				if (m.t == "chat") {
					onmessage({ time: new Date(), nick: m.n, message: m.m, score: m.s, spamCount: m.c });
				}
				if (m.t == "who") {
					var r = pending[m.id];
					if (r) {
						delete pending[m.id];
						r.f(m.who);
					}
				}
			};

			return {
				chat: function(message) {
					console.log('> ' + message);
					chat.send(JSON.stringify({ t: 'chat', m: message }));
				},

				nick: function(nick) {
					chat.send(JSON.stringify({ t: 'nick', n: nick }));
				},

				who: function(f) {
					var id = requestId ++;
					pending[id] = { f: f, t: new Date() };
					chat.send(JSON.stringify({ t: 'who', id: id }));
				}
			}
		}
	};

	return exports;
});
