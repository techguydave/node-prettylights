# node-prettylights

Twitch Plays Light Simulator 2015

## Installing

Absolutely no clue. I guess download this repository...

```bash
$ git clone https://github.com/synth3tk/node-prettylights.git
```

...then bash your head on the keyboard in the following sequence:

```bash
$ npm install
```

Tell me if it doesn't work. Because I definitely didn't test installing this thing from scratch. The only other thing I made with Node was a website, so I'm not sure how to make this distribution-friendly. Feel free to tell me how wrong I am on [Twitter](https://twitter.com/synth3tk).

## Configuration

Create the file `config/.env` (good luck, Windows users!) with the following three lines:

* `TWITCH_USER=<bot_name_username>`
  * Create a new account for the bot if you haven't already
* `TWITCH_OAUTH=<bot_oauth_password>`
  * Visit http://twitchapps.com/tmi/ to generate an OAuth password
* `TWITCH_CHANNELS=<channels>`
  * A comma-separated value of channels for the bot to enter (ideally, your channel).

While giving the bot mod powers is completely optional at this time, you can go ahead and do it anyway. I don't care, it's your channel!

## Start it up

```bash
$ node server.js
```

The bot will now search for a Hue bridge, register itself (first run), collects information about the Hue setup and stores it in a file (first run), then it finally joins Twitch chat, waiting for your users to abuse it!

## TO-DO

* Organize the code better
* Proper error handling 
* Option to flash lights on events (follower, subscription, etc)
* Blacklist/whitelist ability
* Flood control (holy crap, why's that not in the 1.0 release?)
* Buy more body wash
