var dotenv = require('dotenv');
dotenv._getKeysAndValuesFromEnvFilePath('config/.env');
dotenv._setEnvs();

var twitch_user = process.env.TWITCH_USER,
twitch_oauth = process.env.TWITCH_OAUTH,
twitch_channels = process.env.TWITCH_channels;

var irc = require('twitch-irc'),
hue = require("node-hue-api"),
async = require('async'),
_ = require('lodash'),
Datastore = require('nedb');

// initialize the db
var db = {};
db.hue = new Datastore({ filename: 'config/hue.db', autoload: true });
db.twitch = new Datastore({ filename: 'config/twitch.db', autoload: true });

// Variables go here
var hueClass = hue.HueApi,
hueApi = new hueClass();

var displayError = function(err) {
    console.error(err);
};

async.waterfall([
    function(callback){
    	db.hue.find({_id: 'bridge'}, function (err, docs) {
    		if(err) displayError(err);
    		if(docs.length===0){
    			// Bridge not found, let's find and add it
    			hue.nupnpSearch().then(function(result){
    				delete result[0]['id'];
    				result[0]._id = 'bridge';
    				// insert it into the db
    				db.hue.insert(result, function (err, newDoc) {
    					if(err) displayError(err);
    					callback(null, newDoc.hostname);
    				});
    			}).done();
    		} else {
    			callback(null, docs[0]['ipaddress']);
    		};
    	});
	},
	function(hostname, callback){
		db.hue.find({_id: 'username'}, function (err, docs) {
			if(err) displayError(err);
			if(docs.length===0){
				newHue.registerUser(hostname, null, 'Prettylights Twitch Bot')
			    .then(function(result){
					// insert it into the db
			    	var doc = {};
			    	doc._id = 'username';
			    	doc.value = result;
					db.hue.insert(doc, function (err, newDoc) {
						if(err) displayError(err);
						callback(null, hostname, newDoc.value);
					});
			    })
			    .fail(displayError)
			    .done();
			} else {
				callback(null, hostname, docs[0]['value']);
			}
		});
	}
], function (err, hostname, username) {
	var lightsApi = new hueClass(hostname, username);
	
	lightsApi.getFullState().then(function(result){
		_.forEach(result, function(value, name){
			var doc = value;
			doc._id = name;
			db.hue.insert(doc, function (err, newDoc) {
				if(err) return;
			});
		});

		twitchBot(lightsApi);
	}).done();
});

// Add the bot to channel(s) and listen for commands
var twitchBot = function(lightsApi){
	var lightState = hue.lightState,
	state = lightState.create();
	var test = state.hsl;
	
	// Twitch client options...
	var client = new irc.client({
	 options: {
	     debug: true,
	     debugIgnore: ['ping', 'chat', 'action'],
	     tc: 3
	 },
	 identity: {
	     username: twitch_user,
	     password: twitch_oauth
	 },
	 channels: [twitch_channels]
	});
	
	var whiteState = function(){
		 lightsApi.setGroupLightState(0, { 'on': true, 'ct': 200, 'bri': 180, 'effect': 'none' }, function(err, lights){
			 if (err) throw err;
		 });
	}
	
	// Connect to the chat server..
	client.connect();
	
	// Chat event listeners
	client.addListener('chat', function (channel, user, message) {
		if (message.toLowerCase() === "!lights") {
			client.say(channel, '!lights on - !lights off - !lights pretty - !lights &lt;color&gt; (white, red, blue, yellow, green, purple)');
		}

		 if (message.toLowerCase() === '!lights off') {
			 lightsApi.setGroupLightState(0, {'on': false}, function(err, lights){
				 if (err) throw err;
			 });
		 }
		 
		 if (message.toLowerCase() === ('!lights white' || '!lights on')) {
			 whiteState();
		 }
		 
		 if (message.toLowerCase() === '!lights red') {
			 whiteState();
			 lightsApi.setGroupLightState(0, { 'on': true, 'hue': 65534, 'bri': 180, 'sat': 255, 'effect': 'none' }, function(err, lights){
				 if (err) throw err;
			 });
		 }
		 
		 if (message.toLowerCase() === '!lights green') {
			 whiteState();
			 lightsApi.setGroupLightState(0, { 'on': true, 'hue': 25500, 'bri': 180, 'sat': 255, 'effect': 'none' }, function(err, lights){
				 if (err) throw err;
			 });
		 }
		 
		 if (message.toLowerCase() === '!lights blue') {
			 whiteState();
			 lightsApi.setGroupLightState(0, { 'on': true, 'hue': 46920, 'bri': 180, 'sat': 255, 'effect': 'none' }, function(err, lights){
				 if (err) throw err;
			 });
		 }
		 
		 if (message.toLowerCase() === '!lights purple') {
			 whiteState();
			 lightsApi.setGroupLightState(0, { 'on': true, 'hue': 56100, 'bri': 180, 'sat': 255, 'effect': 'none' }, function(err, lights){
				 if (err) throw err;
			 });
		 }
		 
		 if (message.toLowerCase() === '!lights yellow') {
			 whiteState();
			 lightsApi.setGroupLightState(0, { 'on': true, 'hue': 16750, 'bri': 180, 'sat': 200, 'effect': 'none' }, function(err, lights){
				 if (err) throw err;
			 });
		 }
		 
		 if (message.toLowerCase() === '!lights pretty') {
			 lightsApi.setGroupLightState(0, { 'on': true, 'effect': 'colorloop', 'bri': 180 }, function(err, lights){
				 if (err) throw err;
			 });
		 }
	});
}