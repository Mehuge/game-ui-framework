"use strict";
// Initialise the UI, defines the global UI object which provides the UI javascript interface
// and provides a method of loading the UI components
define(function() {

	// UI components list
	var registered = {},
		LOADING = 0,
		LOADED = 1,
		RUNNING = 2,
		idSequence = 0;

	// Give a module name of a component, find the component entry in
	// the registry.  if the module is not for a component, return 
	// undefined
	function _findComponentForModule(module) {
		for (var key in registered) {
			var component = registered[key];
			if (component.module == module) return component;
		}
	};

	// Get a component from the registry by name, creating it in the registry
	// if its not already there.
	function _get(name) {
		return registered[name] = registered[name] || { name: name };
	};

	// Once modules are loaded, this function is called to check if its a
	// component and if it is, start it by calling the run() method.
	function _init(modules, args) {
		for (var i = 0; i < modules.length; i++) {
			var component = _findComponentForModule(modules[i]);
			if (component) {
				if (args[i]) {
					var constructor = component.constructor = args[i];
					var readyState = component.readyState || LOADING;
					if (readyState < LOADED) {
						readyState = component.readyState = LOADED;
					}
					if (typeof constructor.run == "function")  {
						if (readyState < RUNNING) {
							constructor.run();
							component.readyState = RUNNING;
						}
					} 
				} else {
					console.warn(component.name + ' did not define an interface');
				}
			}
		}
	};

	// Internal version of require.  Takes a list of module names
	// and loads them, if they are for components, marks the and
	// the component is not already loaded, marks them as loaded
	// and run()s them if necessary.
	function _require(modules, callback) {
		for (var i = 0; i < modules.length; i++) {
			var component = _findComponentForModule(modules[i]);
			if (component) {
				component.readyState = component.readyState || LOADING;
			}
		}
		require(modules, function() {
			_init(modules,arguments);
			if (callback) {
				return callback.apply(UI, arguments);
			}
		});
	};

	// Given a list of component and module names, 
	// return a list of module names to load (can be passed to define)
	function _c2m(components) {
		var modules = [];
		for (var i = 0; i < components.length; i++) {
			var name = components[i];
			if (name.substr(0,3) == 'ui/' || name.substr(0,2) == './' || name.substr(0,5) == 'text!') {
				// its a module name
				modules.push(name);
			} else {
				var component = _get(name);
				component.module = component.module || "ui/"+name+"/"+name;
				modules.push(component.module);
			}
		}
		return modules;
	};

	// Component list to required component names array
	function _cl2n(components) {
		var requires = [];
		for (var i = 0; i < components.length; i++) {
			if (!components[i].disabled) {					
				requires.push(components[i].name);
			}
		}
		return requires;
	}

	// Function to load the UI components listed in specified module
	// Modules are loaded in the order they are listed using requirejs
	// each module
	function _load(from) {
		// Load the components list (ui-components.js probably)
		require([ from ], function(components) {
			// then require them all so they get loaded in order
			_require(_c2m(_cl2n(components)));
		});
	};

	// Define components, convert to module names, init them once loaded
	function _define(components, ready) {
		var modules = _c2m(components);
		define(modules,function() {
			_init(modules, arguments);
			return ready.apply(UI, arguments);
		});
	};

	// UI public interface(s)
	return { 

		// UI.load('ui/ui-components') - Loads the UI, called by client.html 
		load: function(from) { _load(from); },

		// UI.define(['component],...], function(c1,c2,...) {
		define: function(components, ready) {
			_define(components, ready);
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
		html: function(html) {
			var div = document.createElement('div');
			div.innerHTML = html;
			var node = div.firstChild, id = node.id;
			if (!id) node.id = id = 'ui-' + idSequence ++;
			document.body.appendChild(node);
			return $('#'+node.id);
		}
	};
});
