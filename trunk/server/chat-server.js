var WebSocketServer = require('websocket').server;
var http = require('http');
var Channel = require('./chat-channel');
var server = http.createServer(function(request, response) {
	// process HTTP request. Since we're writing just WebSockets server
	// we don't have to implement anything.
});
server.listen(1337, function() { 
	console.log((new Date()) + " Server is listening on port 1337");
});

// create the server
var wsServer = new WebSocketServer({
	httpServer: server
});

// WebSocket server
wsServer.on('request', function(request) {

	try {

		// Accept the connection from this client.
		var connection = request.accept('chat', request.origin),

			// Request URI
			URI = request.resourceURL,

			// The pathname defines the chat channel
			path = URI.pathname; 

		// Get the chat channel
		var channel = Channel.open(path);

		// Define a client object
		var client = { nick: URI.query.nick, connection: connection };

		// Join this channel
		channel.join(client);

		// This is the most important callback for us, we'll handle
		// all messages from users here.
		connection.on('message', function(message) {
			if (message.type === 'utf8') {
				// process WebSocket message
				try {
					var m = JSON.parse(message.utf8Data);
				} catch(e) {
					connection.sendUTF(JSON.stringify({ t: 'error', e: e, m: "could not parse message" }));
				}
				if (m) {
					m.s = (new Date()).valueOf();
					switch (m.t) {
					case 'chat':
						m.n = client.nick;
						channel.chat(client, m);
						break;
					case 'who':
						channel.who(client, m.id);
						break;
					case 'nick':
						if (!channel.inuse(client, m.n)) {
							m.m = client.nick + ' changed nick to ' + m.n;
							client.nick = m.n;
							m.n = 'System';
							channel.chat(client, m);
						} else {
							connection.sendUTF(JSON.stringify({ t: 'chat', n: 'System', m: m.n + " is already in use" }));
						}
						break;
					}
				}
			}
		});

		connection.on('close', function(connection) {
			// close user connection
			channel.leave(client);
		});

	} catch(e) {

		console.error(e);
	}
});
