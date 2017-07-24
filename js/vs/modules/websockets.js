---
layout: compress-js
---
VS.WebSocket = (function() {
    var ws = {};

    var socket,
        host = (location.protocol === "https:" ? "wss://" : "ws://") + location.hostname + ":4001",
        logElement = document.getElementById("ws-log");

    function connect() {
        try {
            socket = new WebSocket(host);

            socket.onopen = function() {
                logMessage("Open");
                addControlCallbacks();
            };

            socket.onclose = function(e) {
                if (e.code === 3001) {
                    logMessage("Closed");
                } else {
                    logMessage("Not connected");
                }
            };

            socket.onmessage = function(msg) {
                try {
                    var data = JSON.parse(msg.data);
                    if (data.type === "ws" && data.content === "connected") {
                        ws.cid = data.cid;
                    }
                    // if not sent by self
                    if (data.cid !== ws.cid) {
                        switch(data.scoreEvent) {
                            case "play":
                                VS.score.play();
                                break;
                            case "pause":
                                VS.score.pause();
                                break;
                            case "stop":
                                VS.score.stop();
                                break;
                            case "step":
                                updatePointer(data.pointer); // TODO add to VS, not global
                                scrollCallback(); // TODO -- hardcoded for ad;sr currently
                                break;
                        }
                    }
                }
                catch (err) {
                    logMessage("Receive error: " + err);
                }
            };

        } catch(exception) {
            logMessage("Connection error: " + exception);
        }
    }

    function addControlCallbacks() {
        VS.control.playCallback = function() {
            VS.WebSocket.send({ scoreEvent: "play", pointer: VS.score.pointer });
        };
        VS.control.pauseCallback = function() {
            VS.WebSocket.send({ scoreEvent: "pause", pointer: VS.score.pointer });
        };
        VS.control.stopCallback = function() {
            VS.WebSocket.send({ scoreEvent: "stop" });
        };
        VS.control.stepCallback = function() {
            VS.WebSocket.send({ scoreEvent: "step", pointer: VS.score.pointer });
        };
    }

    function logMessage(msg) {
        logElement.innerHTML = msg;
    }

    ws.send = function(data) {
        data.cid = ws.cid; // attach client ID to all
        try {
            socket.send(JSON.stringify(data));
        } catch(err) {
            logMessage("Send error: " + err);
        }
    };

    connect();

    return ws;
})();
