# Welcome to TeamCity Watcher with Johnny-Five

Johnny-five is a Javascript Robotics library and can be used to interact with Arduino programmable boards. This repo contains a very basic Node App that connects to TeamCity to check the build state for each build. If the build fails, it will be displayed on the very basic dashboard and will light up the LED display we have surrounding the TV.

## Getting Started

First clone the repo and run

```
npm install
```

Rename the `config.template.js` file to `config.js` and fill in your details and repo information. By default config.js is ignored in the `.gitignore` file. Your new `config.js` file has a few config settings etc which can be changed if/when needed.

Connect your Arduino board to the PC/Server that will be running the app and make sure you have the correct firmware on the board as per the [Johnny-Five documentation](http://johnny-five.io/platform-support/)

Once the board is connected (make sure you have set up the correct **COM PORT**) connect your relay to the desired pin on your Arduino. The config is currently set up for **pin 3** but this can be set to any digital or analog pin.

Next fire up `server.js` to start the app, make sure everything connects and you should see the following in your `cmd` console

```javascript
1506636550349 Connected COM4
The magic happens on port 8888
1506636554015 Repl Initialized
>>
```

You can now navigate to localhost:8888 to see the dashboard.

## Breakdown
The application is a Node app and is broken down into a `server` and `www` folder.

### Server Folder
Nothing too special going on here, it is a basic Node app but with some additional functionality to control a relay to light up the LED display. 

- We use [Socket.IO](https://socket.io/) to communicate the build state and relay state with the front end.
- [Johnny-Five](http://johnny-five.io/) to control set up communication with the Arduino board to control the relay.

We also have 4 very basic API's we can call

- `/relay` Gets the status of the relay: returns json `{relayState: {relayState: "on" of "off"}
- `/stop` Stops polling the teamcity build.
- `/start` Starts polling the teamcity build if it has been stopped.
- `/buildcheck` Checks all builds.

### WWW Folder
The UI uses the [Bootswatch Yeti theme](https://bootswatch.com/yeti/) (it doesn't really need it as I'm only using it for the Jumbotrons and alert banners) and [Vue.js](https://vuejs.org/) for the client side javascript.