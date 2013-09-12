"use strict";
define(function() {
	var topics = {};
	return UI.std = {
		pad: function(s,n) {
			return String(s).length < n ? this.pad('0'+s,n) : s;
		},

		// A simple pub/sub system, allows passing of UI events around in a uncoupled way
		// so mods don't need to be aware of each other, only the even they fire.
		pub: function(topic, content) {
			topic = topics[topic];
			if (topic) {
				for (var i = 0; i < topic.handlers.length; i++) {
					try { 
						(topic.handlers[i])(content, topic);
					} catch(e) {
						console.error(e);
					}
				}
			}
		},
		sub: function(topic, handler) {
			(topics[topic] = topics[topic] || { topic: topic, handlers: [] }).handlers.push(handler);
		}
	};
});
