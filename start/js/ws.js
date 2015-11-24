var wsServer = 'ws://{{ origin }}',
    websocket = new WebSocket(wsServer);

websocket.onopen = function(evt) {
    console.log('[transport start success]');
};
websocket.onclose = function(evt) {
    console.log('[transport closed please check the server or refresh this page]');
};
websocket.onmessage = function(evt) {
    excuteCommand(parseCommand(evt.data));
};
websocket.onerror = function(evt) {
    console.log('[transport closed please check the server or refresh this page]');
};