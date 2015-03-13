# Introduction #

A simple Hello World UI example, that prints hello world into the chat frame.  Demonstrates how to structure a UI, how to specify dependancies, and how to define a public API so that other UI components can interact.

# Step 1: Create empty UI component #

Here we create a basic UI component that does nothing and exposes no public interface.

  1. Create a directory in the **ui** folder called **helloworld**
  1. Create a text file and call it **helloworld.js**

```
UI.define([], function() {
});
```

UI.define() will call the passed constructor function, who's return value defines the public interface for the component.

# Step 2: Add dependancies #

Because our **HelloWorld** UI wants to send a message to the **ChatBox**, we need to be able to talk to the **ChatBox** UI.  The simplest way to do this is to specify **ChatBox** as a dependency.  Doing this will ensure that the **ChatBox** UI is loaded before our **HelloWorld** UI is initialised.  To do this we add a dependency list to the first argument of UI.define():-

```
UI.define( 'chatbox' ], function(chatbox) {
  chatbox.println('hello world');
});
```

Each dependency listed is loaded and a reference to it passed as an argument to the constructor function.  The order of the dependencies and the reference arguments must match exactly, otherwise bad things will happen (script errors).

We have our very basic **HelloWorld** UI at this point.  However to load it we need to tell the UI framework to load it.  To do this, add helloworld as an entry in **autostart.js**

```
UI.require([ 'helloworld' ]);
```

Because we specified **ChatBox** as a dependancy, it will automatically be loaded by the UI framework, and doesn't need to be specified as an autostart component, however as we probably always want to see the **ChatBox** UI we would probably add it anyway.

```
UI.require([ 'chatbox', 'helloworld' ]);
```

# Step 3: Define our public interface #

Lets suppose we want to allow other UI components to say hello too, we can expose a method that would allow them to do that.  Lets call it **sayHello()**.  A public interface is defined by the return value of the constructor function

```
UI.define([ 'chatbox' ], function(chatbox) {
  return { };    // empty public interface
});
```

So to add our **sayHello()** method we simply add it to its return value:-

```
UI.define([ 'chatbox' ], function(chatbox) {
  return {
    sayHello: function() {
      chatbox.println('hello world');
    }
  };
});
```

Other components must specify hello world as a dependency to be able to access the **sayHello()** method, for example:-

```
UI.define([ 'helloworld', function(helloworld) {
  helloworld.sayHello();
});
```

Alternatively, **HelloWorld** can expose its interface via the UI global object, as follows:-

```
UI.define([ 'chatbox' ], function(chatbox) {
  return UI.HelloWorld = {
    sayHello: function() {
      chatbox.println('hello world');
    }
  };
});
```

Now, other components can now call **UI.HelloWorld.sayHello()** directly, but only if they know **HelloWorld** component has been loaded.

# Step 4: Autostarting #

Our **HelloWorld** component doesn't do much at this point, but it does allow other components to say hello.  What if we want to say hello ourselves when we load.  Well we could do the following:-

```
UI.define([ 'chatbox' ], function(chatbox) {
  chatbox.println('hello world');
  return UI.HelloWorld = {
    sayHello: function() {
      chatbox.println('hello world');
    }
  };
});
```

And that would work, however a better way to actually run stuff (rather than initialise stuff) is to define a **run()** method on the public interface as follows:-

```
UI.define([ 'chatbox' ], function(chatbox) {
  return UI.HelloWorld = {
    run: function() {
      this.sayHello();
    },
    sayHello: function() {
      chatbox.println('hello world');
    }
  };
});
```

The **run()** method is automatically called by the UI framework once the component has loaded and been initialised (defined its public interface).

And that's it, our **HelloWorld** UI component is complete.  It says hello world when its loaded, and allows other UI components to use it to also say hello world.