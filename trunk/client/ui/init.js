"use strict";
// Initialise the UI, defines the global UI object which provides the UI javascript interface
// and provides a method of loading the UI components
define(function(global) {

	var _r = {}, _m = {},			// registered components and module map
		LOADING = 0,				// ready states
		INITIALISED = 1,
		DEFINED = 2,
		STARTED = 3,
		idSequence = 0;				// auto id sequence

	// pub/sub topics
	var topics = {};

	// Once modules are loaded, this function is called to check if its a
	// component and if it is, start it by calling the run() method, if its
	// not already been started.
	function _init(modules, args) {
		for (var i = 0; i < modules.length; i++) {
			var component = _m[modules[i]];
			if (component) {
				if (args[i]) {
					var pub = component.interface = args[i];
					var readyState = component.readyState || LOADING;
					if (typeof pub.run == "function")  {
						if (readyState < STARTED) {
							pub.run();
							component.readyState = STARTED;
						}
					} else {
						if (readyState < DEFINED) {
							component.readyState = DEFINED;
						}
					}
				} else {
					if (component.readyState < INITIALISED) {
						component.readyState = INITIALISED;
					}
				}
			}
		}
	};

	// Require modules
	function _require(modules, constructor) {
		require(modules, function() {
			_init(modules,arguments);
			if (constructor) {
				return constructor.apply(UI, arguments);
			}
		});
	};

	// Define modules
	function _define(modules, constructor) {
		define(modules,function() {
			_init(modules, arguments);
			return constructor ? constructor.apply(UI, arguments) : {};
		});
	};

	// Given a list of component and module names, 
	// return a list of module names to load (can be passed to require/define)
	function _c2m(components) {
		var modules = [];
		for (var i = 0; i < components.length; i++) {
			var name = components[i];
			if (name.substr(0,3) == 'ui/' || name.substr(0,1) == '/' || name.substr(0,1) == '.' || name.substr(0,5) == 'text!') {
				// its a module name
				modules.push(name);
			} else {
				// its a component
				var component = _r[name] = _r[name] || { name: name, dependants: -1 };
				component.dependants++;
				component.module = component.module || "ui/"+name+"/"+name;
				component.readyState = component.readyState || LOADING;
				_m[component.module] = component;				// update module map (points back to component)
				modules.push(component.module);
			}
		}
		return modules;
	};

	function _unload(name) {
		var component = _r[name];
		if (component && component.dependants == 0) {
			if (component.interface && component.interface.stop) {
				component.interface.stop();
			}
			requirejs.undef(component.module);
			// need to remove the script element for this module
			$("head script[data-requiremodule='"+component.module+"']").remove();
			delete _r[name].interface;
			delete _r[name].readyState;
			component.dependants = -1;
			return true;
		}
	}

	// UI public interface(s)
	return { 

		// UI.define(['component',...], function(c1,c2,...) {
		define: function(components, constructor) {
			_define(_c2m(components), constructor);
		},

		// UI.require(['component',...], function(c1,c2,...) {
		require: function(components, constructor) {
			_require(_c2m(components), constructor);
		},

		// UI.mixin(dest, source) - mixes source properties into dest object
		mixin: function(d,s) {
			for (var k in s) {
				if (s.hasOwnProperty(k)) d[k] = s[k];
			}
		},

		// Stop a UI component and unload it (experimental)
		unload: function(name) {
			return _unload(name);
		},

		// UI.css(cssText) - adds CSS styles to UI header
		css: function(css) {
			var style = $('<style type="text/css">'+css+'</style>');
			$(document.head).append(style);
			return style;
		},

		// UI.html(htmlText) - adds HTML to the UI body
		html: function(html, options) {
			var node = $(html);
			if (options && options.id) node.attr("id", options.id);
			var id = node.attr("id");
			if (!id) node.attr("id", id = 'ui-' + idSequence++);
			$(document.body).append(node);
			return node;
		},

		// list loaded addons
		addons: function() {
			var addons = [];
			for (var k in _r) {
				if (_r.hasOwnProperty(k)) {
					addons.push(_r[k]);
				}
			}
			return addons;
		},

		// A simple pub/sub system, allows passing of UI events around in a uncoupled way
		// so mods don't need to be aware of each other, only the event they fire.
		pub: function(topic, content) {

			if (this.debug) {
				var log = "[" + topic;
				try { log += " " + JSON.stringify(content); } catch(e) { };
				console.log(log+"]");
			}

			var handlers = topics[topic];
			if (handlers) {
				for (var i = 0; i < handlers.length; i++) {
					try { 
						(handlers[i])(content, topic);
					} catch(e) {
						console.error(e);
					}
				}
			}
		},
		sub: function(topic, handler) {
			(topics[topic] = topics[topic] || []).push(handler);
		},

		// Given an options, and a query position, return the css properties to have this
		// element suitably anchored to the closest edges of the window
		anchor: function(o, p) {

			// get component size
			var s = { w: o.outerWidth(), h: o.outerHeight() },							

				// window size
				w = $(this.window), ws = { w: w.innerWidth(), h: w.innerHeight() },

				// center point of the component in the window
				c = { x: p.left+(s.w/2), y: p.top+(s.h/2) },

				// center point of the window
				c2 = { x: ws.w/2, y: ws.h/2 },

				// Work out how to anchor the component
				anchor = {
					h: c.x < c2.x ? 'left' : 'right',
					v: c.y < c2.y ? 'top' : 'bottom'
				};

			// initialise positioning properties
			var pos = { left: 'auto', right: 'auto', top: 'auto', bottom: 'auto' };

			// calculate positions based on how we want the element anchored
			switch(anchor.h) {
			case 'left': 	pos.left = p.left + 'px'; break;
			case 'right': 	pos.right = (ws.w-(p.left+s.w)) + 'px'; break;
			}
			switch(anchor.v) {
			case 'top': 	pos.top = p.top + 'px'; break;
			case 'bottom':  pos.bottom = (ws.h-(p.top+s.h)) + 'px'; break;
			}

			// (re)position this element
			o.css(pos);

			// return new position
			return pos;
		}

	};
});
