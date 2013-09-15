"use strict";
// Initialise the UI, defines the global UI object which provides the UI javascript interface
// and provides a method of loading the UI components
define(function() {

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
					var pub = component._i = args[i];
					var readyState = component.readyState || LOADING;
					if (typeof pub.run == "function")  {
						if (readyState < STARTED) {
							pub.run();
							component.readyState = STARTED;
						}
					} else {
						if (readyState < DEFINED) {
							component.readyState = DEFINED;
							console.log(component.name + " did not define a run() method");
						}
					}
				} else {
					if (component.readyState < INITIALISED) {
						console.warn(component.name + ' did not define an interface');
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
				var component = _r[name] = _r[name] || { name: name };
				component.module = component.module || "ui/"+name+"/"+name;
				component.readyState = component.readyState || LOADING;
				_m[component.module] = component;				// update module map (points back to component)
				modules.push(component.module);
			}
		}
		return modules;
	};

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

		// UI.css(cssText) - adds CSS styles to UI header
		css: function(css) {
			var style = document.createElement("style");
			style.type = "text/css";
			style.textContent = css;
			document.head.appendChild(style);
			return $(style);
		},

		// UI.html(htmlText) - adds HTML to the UI body
		html: function(html, options) {
			var div = document.createElement('div');
			div.innerHTML = html;
			var node = div.firstChild;
			if (options && options.id) node.id = options.id;
			var id = node.id;
			if (!id) node.id = id = 'ui-' + idSequence ++;
			document.body.appendChild(node);
			return $('#'+node.id);
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
