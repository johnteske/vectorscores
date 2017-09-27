---
layout: compress-js
---
VS.WebSocket = (function () {
    var ws = {};

    var socket,
        host = (location.protocol === "https:" ? "wss://" : "ws://") + location.hostname + ":4001";

    var log = (function () {
        var element = document.getElementById("ws-log");

        return function (msg) {
            element.innerHTML = msg;
        };
    })();

    log("Not connected");

    function addControlCallbacks() {
        if (VS.control) {
            VS.control.playCallback = function () {
                VS.WebSocket.send(["vs", "", "play", VS.score.pointer]);
            };
            VS.control.pauseCallback = function () {
                VS.WebSocket.send(["vs", "", "pause", VS.score.pointer]);
            };
            VS.control.stopCallback = function () {
                VS.WebSocket.send(["vs", "", "stop"]);
            };
            VS.control.stepCallback = function () {
                VS.WebSocket.send(["vs", "", "step", VS.score.pointer]);
            };
        }
    }

    ws.messageCallback = VS.noop;
    ws.playCallback = VS.noop;
    ws.pauseCallback = VS.noop;
    ws.stopCallback = VS.noop;
    ws.stepCallback = VS.noop;

    ws.connect = function () {
        try {
            socket = new WebSocket(host);

            socket.onopen = function () {
                log("Open");
                addControlCallbacks();
            };

            socket.onclose = function (e) {
                if (e.code === 3001) {
                    log("Closed");
                } else {
                    log("Not connected");
                }
            };

            socket.onmessage = function (msg) {
                try {
                    var data = JSON.parse(msg.data);
                    var type = data[0];
                    var cid = data[1];
                    var msg = data[2];

                    if (type === "ws" && msg === "connected") {
                        ws.cid = cid;
                    } else if (type === "ws" && msg === "connections") {
                        log("Open, " + data[3] + " connection(s) total");
                    } else if (type === "ws" && msg === "reload") {
                        window.location.reload(true);
                    }

                    // if not sent by self
                    if (type === "vs" && cid !== ws.cid) {
                        switch(msg) {
                            case "play":
                                VS.score.play();
                                ws.playCallback();
                                break;
                            case "pause":
                                VS.score.pause();
                                ws.pauseCallback();
                                break;
                            case "stop":
                                VS.score.stop();
                                ws.stopCallback();
                                break;
                            case "step":
                                VS.score.updatePointer(data[3]);
                                VS.control.updateStepButtons();
                                ws.stepCallback();
                                break;
                        }
                    }

                    ws.messageCallback(data);
                }
                catch (err) {
                    log("Receive error: " + err);
                }
            };

        } catch (err) {
            log("Connection error: " + err);
        }
    };

    ws.send = function (data) {
        data[1] = ws.cid; // attach client ID to all
        try {
            socket.send(JSON.stringify(data));
        } catch (err) {
            log("Send error: " + err);
        }
    };

    return ws;
})();
