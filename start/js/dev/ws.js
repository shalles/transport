var Callback = require('callback.js');

var wsLinkStr = __ST.wsLinkStr || 'ws://127.0.0.1',
    websocket = new WebSocket(wsLinkStr),
    WS = {
        receiver: function(){},
        sender: websocket.send
    };

websocket.onopen = function(evt) {
    console.log('[transport start success]');
};
websocket.onclose = function(evt) {
    console.log('[transport closed please check the server or refresh this page]');
};
websocket.onmessage = function(evt) {
    WS.receiver(evt.data, evt);
};
websocket.onerror = function(evt) {
    console.log('[transport closed please check the server or refresh this page]');
};

module.exports = WS;