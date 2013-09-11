"use strict";
// Hello world example
//
// Use UI.define() to add dependancies on other modules, so in this cast the [ 'chatbox' ] means that this UI mod
// requires the chatbox mod to be loaded.  Once loaded the function passed to UI.define is called.
//
// The function an object, with 1 method, run().  The run() method is automatically called by the UI framwork when
// this mod is loaded, so we don't need to call it manually (though we could have).
//
// The run() method uses that chatbox reference it was given to call println() which outputs a message into the general
// chat window.
//
//	Finally, it sets UI.HelloWorld equal to the object its also returning, this exposes the UI to all other UI mods,
//	so other mods can call: UI.HelloWorld.sayHello() and it will write messages to the chat log.
//
UI.define([ 'chatbox' ], function(chatbox) {
	return UI.HelloWorld = { 
		run: function() {
			this.sayHello();
		},
		sayHello: function() {
			chatbox.println("hello world");
			chatbox.println("<span style='color:red'>red hello world</span>");
			chatbox.println("<b>bold hello world</b>");
		}
	};
});
