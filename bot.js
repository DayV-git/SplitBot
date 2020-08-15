const tmi = require('tmi.js');
const config = require('./config');
var net = require('net');
console.log('The bot is  starting');

var client = new net.Socket();
var response = '';
const commands = ['commands', 'split', 'pb', 'time'];
var timeouts = [];
for(let c of commands){
	timeouts.push(true);
}
const timeout = 10000;
client.connect(config.port, 'Localhost', function() {
	console.log('Connected to LiveSplit');
}); 

client.on('data', function(data) {
  response += data.toString() + ' ';
});

// Define configuration options
const opts = {
  identity: {
    username: config.bot_name,
    password: config.auth_token
  },
  channels: [
    config.channel_name
  ]
};

// Create a client with our options
const chat = new tmi.client(opts);

// Register our event handlers (defined below)
chat.on('connected', onConnectedHandler);
chat.on('message', onMessageHandler);

// Connect to Twitch:
chat.connect();

// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`); 
}

// Called every time a message comes in
function onMessageHandler (target, context, msg, self) {
	if(msg[0] == '!'){
		comm  = msg.split(' ')[0].slice(1);
		if (commands.indexOf(comm) > -1 && timeouts[commands.indexOf(comm)]){
			doCommand(comm);
			timeouts[commands.indexOf(comm)] = false;
			setTimeout((c) => timeouts[commands.indexOf(c)] = true, timeout, comm);
		}
	}
}

async function doCommand(comm){
	if(comm == 'split'){
		client.write("getprevioussplitname\r\n");
		client.write("getdelta\r\n");
		client.write("getlastsplittime\r\n");
		await setTimeout(() => printSplit().then(() => response = ''), 50);
		
		function printSplit(){
			if(response[0] == '-'){
				response = 'No last split';
			} else {
				response = 'Last split: ' + response;
			}
			return chat.say(config.channel_name, response);
		}
	
	} else if (comm == 'pb'){
		client.write("getfinaltime\r\n");
		await setTimeout(() => printPB().then(() => response = ''), 50);
		
		function printPB(){
			response = 'My PB is ' + response;
			return chat.say(config.channel_name, response);
		}
		
	} else if (comm == 'time'){
		client.write("getcurrenttime\r\n");
		await setTimeout(() => printtime().then(() => response = ''), 50);
		
		function printtime(){
			if(response.slice(0,7) == '0:00.00') {
				response = 'No current run';
			} else {
				response = 'Current run time is ' + response;
			}
			return chat.say(config.channel_name, response);
		}
	
	
	} else if (comm == 'commands'){
		res = 'Commands:';
		for (let c of commands.slice(1)){
			res += ' !' + c;
		}
		
		chat.say(config.channel_name, res);
	
	}

}
