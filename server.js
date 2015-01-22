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
	var test = state.hsl
	
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
	
	// Connect to the chat server..
	client.connect();
	
	// Chat event listeners
	client.addListener('chat', function (channel, user, message) {
		if (message.indexOf('!lights help') === 0) {
			client.say(channel, '!lights on - !lights off - !lights pretty - !lights &lt;color&gt; (white, red, blue, yellow, green, purple)');
		}
	});
	
	client.addListener('chat', function (channel, user, message) {
		 if (message.indexOf('!lights off') === 0) {
			 lightsApi.setGroupLightState(0, {'on': false})
			    .then()
			    .fail(displayError)
			    .done();
		 }
	});
	
	client.addListener('chat', function (channel, user, message) {
		 if (message.indexOf('!lights on') === 0) {
			 lightsApi.setGroupLightState(0, { 'on': true, 'ct': 200, 'bri': 180, 'effect': 'none' })
			    .then()
			    .fail(displayError)
			    .done();
		 }
	});
	
	client.addListener('chat', function (channel, user, message) {
		 if (message.indexOf('!lights white') === 0) {
			 lightsApi.setGroupLightState(0, { 'on': true, 'ct': 200, 'bri': 180, 'effect': 'none' })
			    .then()
			    .fail(displayError)
			    .done();
		 }
	});
	
	client.addListener('chat', function (channel, user, message) {
		 if (message.indexOf('!lights red') === 0) {
			 lightsApi.setGroupLightState(0, { 'on': true, 'hue': 65534, 'bri': 180, 'sat': 255, 'effect': 'none' })
			    .then()
			    .fail(displayError)
			    .done();
		 }
	});
	
	client.addListener('chat', function (channel, user, message) {
		 if (message.indexOf('!lights green') === 0) {
			 lightsApi.setGroupLightState(0, { 'on': true, 'hue': 25500, 'bri': 180, 'sat': 255, 'effect': 'none' })
			    .then()
			    .fail(displayError)
			    .done();
		 }
	});
	
	client.addListener('chat', function (channel, user, message) {
		 if (message.indexOf('!lights blue') === 0) {
			 lightsApi.setGroupLightState(0, { 'on': true, 'hue': 46920, 'bri': 180, 'sat': 255, 'effect': 'none' })
			    .then()
			    .fail(displayError)
			    .done();
		 }
	});
	
	client.addListener('chat', function (channel, user, message) {
		 if (message.indexOf('!lights purple') === 0) {
			 lightsApi.setGroupLightState(0, { 'on': true, 'hue': 56100, 'bri': 180, 'sat': 255, 'effect': 'none' })
			    .then()
			    .fail(displayError)
			    .done();
		 }
	});
	
	client.addListener('chat', function (channel, user, message) {
		 if (message.indexOf('!lights yellow') === 0) {
			 lightsApi.setGroupLightState(0, { 'on': true, 'hue': 16750, 'bri': 180, 'sat': 200, 'effect': 'none'})
			    .then()
			    .fail(displayError)
			    .done();
		 }
	});
	
	client.addListener('chat', function (channel, user, message) {
		 if (message.indexOf('!lights pretty') === 0) {
			 lightsApi.setGroupLightState(0, { 'on': true, 'effect': 'colorloop', 'bri': 180 })
			    .then()
			    .fail(displayError)
			    .done();
		 }
	});
}