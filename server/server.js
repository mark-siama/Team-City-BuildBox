// Load express
const express= require('express');
const app = express();
const http = require('http').Server(app);
const serverIO = require('socket.io')(http);
const axios = require('axios');
const path = require('path');
const five = require('johnny-five');
const raspi = require('raspi-io');
const config = require('./config.js');
let buildFailureArray = [];
let connectionErrorArray = [];
let buildCheckArray = [];
let pollingInterval;

// JOHNNY-FIVE CONFIG AND STARTUP
// =============================================================================
const board = five.Board({
    io: new raspi()
});
let relay = null;

board.on("ready", function(){
    relay = new five.Relay(config.relayPin);

    this.repl.inject({
        relay: relay
    });

});

board.on("exit", function(){
    relay.off();
});

// SERVER CONFIG
// =============================================================================
const port = process.env.PORT || 8888;

// SOCKET IO
serverIO.on("connection", function(clientSocket) {

    let status;

    if(board.isReady) {
        status = board.pins[config.relayPin].value == 1 ? 'on' : 'off';
        
        let relayState = {
            relayState: status
        };
    
        serverIO.emit("relay state", relayState);
    }

    serverIO.emit('build array', buildCheckArray);

});


// MIDDLEWARE
// ==================

app.use(express.static(path.join(__dirname, 'www')));


// APIs
// ==================

app.use('/relay', function(req, res){
    let status = board.pins[config.relayPin].value == 1 ? 'on' : 'off';
    return res.json({relayState: status});
});

app.use('/stop', function(req, res) {
    clearInterval(pollingInterval);
    console.info('stop polling');

    return res.json({
        "polling" : false
    });
});

app.use('/start', function(req, res) {
    startPolling();
    console.info('started polling');

    return res.json({
        "polling" : true
    });
});

app.use('/buildcheck', async function(req, res) {
    const buildArrays = await buildCheck();

    return res.json({
        "arrays" : buildArrays
    });
});

// START THE SERVER
// =============================================================================
http.listen(port);
console.info(`The magic happens on port ${port}`);
startPolling();

async function buildCheck(){
    const builds = config.teamCity.builds;
    buildFailureArray = [];
    connectionErrorArray = [];

    for (let build of builds) {
        let buildStatus = await axios.get(build.url, {
            auth: {
                username: config.teamCity.username,
                password: config.teamCity.password
            }
        }).then(function (res) {
            if(res.data !== "SUCCESS") {
                buildFailureArray.push(build.buildName);
                relay.close();
            }
        }).catch(error => connectionErrorArray.push(build.buildName));
    }

    buildCheckArray = [buildFailureArray, connectionErrorArray];

    if(buildFailureArray.length === 0) {
        relay.open();
    }

    serverIO.emit('build array', buildCheckArray);
    
    return buildCheckArray;
}

function startPolling() {
    pollingInterval = setInterval(buildCheck, config.interval );
}