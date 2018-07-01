---
layout: compress-js
---
VS.WebSocket = (function() {
    var ws = {};

    var socket;

    var log = (function() {
        var element = document.getElementById('ws-log');

        return function(msg) {
            element.innerHTML = msg;
        };
    })();

    log('Not connected');

    ws.hooks = VS.createHooks(['play', 'pause', 'stop', 'step', 'message']);

    function addControlHooks() {
        VS.control.hooks.add('play', function() {
            VS.WebSocket.send(['vs', 'play', VS.score.getPointer()]);
        });
        VS.control.hooks.add('pause', function() {
            VS.WebSocket.send(['vs', 'pause', VS.score.getPointer()]);
        });
        VS.control.hooks.add('stop', function() {
            VS.WebSocket.send(['vs', 'stop']);
        });
        VS.control.hooks.add('step', function() {
            VS.WebSocket.send(['vs', 'step', VS.score.getPointer()]);
        });
    }

    function handleWebSocketMsg(data) {
        var cid = data[0];
        var content = data[2];

        if (content === 'connected') {
            ws.cid = cid;
        } else if (content === 'connections') {
            log('Open, ' + data[3] + ' connection(s) total');
        } else if (content === 'reload') {
            window.location.reload(true);
        }
    }

    function handleVectorscoresMsg(data) {
        var content = data[2];

        switch (content) {
            case 'play':
                VS.score.play();
                ws.hooks.trigger('play');
                break;
            case 'pause':
                VS.score.pause();
                ws.hooks.trigger('pause');
                break;
            case 'stop':
                VS.score.stop();
                ws.hooks.trigger('stop');
                break;
            case 'step':
                VS.score.updatePointer(data[3]);
                ws.hooks.trigger('step');
                break;
        }
    }

    ws.connect = function() {
        var host = (location.protocol === 'https:' ? 'wss://' : 'ws://') + location.hostname + ':4001';

        try {
            socket = new WebSocket(host);

            socket.onopen = function() {
                log('Open');
                addControlHooks();
            };

            socket.onclose = function(e) {
                if (e.code === 3001) {
                    log('Closed');
                } else {
                    log('Not connected');
                }
            };

            socket.onmessage = function(msg) {
                try {
                    var data = JSON.parse(msg.data);
                    var cid = data[0];
                    var type = data[1];

                    // WebSockets messages
                    if (type === 'ws') {
                        handleWebSocketMsg(data);
                    }

                    // vectorscores messages, only handle if not sent by self
                    if (type === 'vs' && cid !== ws.cid) {
                        handleVectorscoresMsg(data);
                    }

                    ws.hooks.trigger('message', [data]);
                }
                catch (err) {
                    log('Receive error: ' + err);
                }
            };

        } catch (err) {
            log('Connection error: ' + err);
        }
    };

    ws.send = function(data) {
        // attach client ID to all
        data.unshift(ws.cid);

        try {
            socket.send(JSON.stringify(data));
        } catch (err) {
            log('Send error: ' + err);
        }
    };

    return ws;
})();
