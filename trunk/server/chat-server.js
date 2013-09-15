var WebSocketServer = require('websocket').server;
var http = require('http');
var ChatFilter = require('./chat-filter');

var FilterOptions = {
	filters: [ 
		[ 100, 'c[s5][3e]g[0o][1l]d' ],
		[ 10, 'g[0o][l1]d' ],
		[ 100, 'p[0o]w[3e]r.*[1l][3e]v[3e][1l]' ],
		[ 10, '[1l][3e]v[3e][1l]' ],
		[ 10, 'p[0o]w[3e]r' ],
		[ 60, 'buy.*g[0o][l1]d' ],
		[ 10, 'buy' ],
		[ 10, 'pm' ],
		[ 50, 'www' ],
		[ 100, '(private|pm).*(message|).*g[0o][1l]d' ],
		[ 100, '(private|pm).*(message|).*p[0o]w[3e]r.*[l1][3e]v[3e][1l]' ]
	],

	MAX_SPAM_SCORE: 100,
	MAX_SPAM_COUNT: 10

};



// Note: Using a hash here, doesn't work because the closure gives {} to each call of the handler,
// an array works because the closure gets the array reference
var channels = [];

function Channel(name) {
	var name = name;
	var clients = [];
	return {
		connect: function(client) {
			clients.push(client);
			console.log(name + ' client ' + client.nick + ' connected');
			console.log('connected clients ' + clients.length);
			client.filter = new ChatFilter(FilterOptions);
			this.chat(client, { n: "System", m: client.nick + " has connected" });
		},
		disconnect: function(client) {
			this.chat(client, { n: "System", m: client.nick + " has disconnected" });
			var i = clients.indexOf(client);
			clients.splice(i,1);
			console.log(name + ' client ' + client.nick + ' disconnect');
			console.log('connected clients ' + clients.length);
		},
		chat: function(client, message) {

			// Must be a chat message
			message.t = 'chat';

			// Work out a spam score for this message
			message.s = client.filter.spamScore(message.m);

			// If this is spam, then increment the spam count
			var spam = message.s >= FilterOptions.MAX_SPAM_SCORE;
			if (spam) {
				client.spamCount = (client.spamCount | 0) + 1;
			}

			// If not spam and client not muted
			if (!spam && (client.spamCount|0) < FilterOptions.MAX_SPAM_COUNT) {
				for (var i = 0; i < clients.length; i++) {
					console.log(name + ' ' + client.nick + ' send ' + JSON.stringify(message) + ' to ' + clients[i].nick);
					clients[i].connection.sendUTF(JSON.stringify(message));
				}
			} else {
				// spam, or muted, return to sender
				message.c = client.spamCount;
				console.log(name + ' ' + client.nick + ' COUNT ' + client.spamCount + ' SPAM ' + JSON.stringify(message));
				client.connection.sendUTF(JSON.stringify(message));
			}
		},
		name: function() { return name; },
		who: function(client, id) {
			var who = [];
			for (var i = 0; i < clients.length; i++) {
				who.push(clients[i].nick);
			}
			client.connection.sendUTF(JSON.stringify({ t: 'who', who: who, id: id }));
		}
	};
};


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

		var channel;
		for (var i = 0; i < channels.length; i++) {
			if (channels[i].name() == path) {
				channel = channels[i];
			}
		}
		if (!channel) { 
			channel = new Channel(path);
			channels.push(channel);
		}

		// Define a client object
		var client = { nick: URI.query.nick, connection: connection };

		// Join this channel
		channel.connect(client);

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
						m.m = client.nick + ' changed nick to ' + m.n;
						client.nick = m.n;
						m.n = 'System';
						channel.chat(client, m);
						break;
					}
				}
			}
		});

		connection.on('close', function(connection) {
			// close user connection
			channel.disconnect(client);
		});

	} catch(e) {

		console.error(e);
	}
});
