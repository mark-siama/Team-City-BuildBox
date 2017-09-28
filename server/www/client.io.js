// SOCKET IO
const webSocket = io();

webSocket.on('relay state', function(state) {
    app._data.relayState = state.relayState
});