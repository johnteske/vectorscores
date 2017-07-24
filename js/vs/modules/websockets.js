---
layout: compress-js
---
VS.WebSocket = (function() {
    var ws = {};

    var socket,
        host = (location.protocol === "https:" ? "wss://" : "ws://") + location.hostname + ":4001";

    function connect() {
        try {
            socket = new WebSocket(host);

            socket.onopen = function() {
                logMessage("Open");
            };

            socket.onclose = function() {
                logMessage("Closed");
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

        addControlCallbacks();

        } catch(exception) {
            logMessage("Connection error: " + exception);
        }
    }

    function addControlCallbacks() {
        VS.control.playCallback = function() {
            VS.WebSocket.send({ cid: ws.cid, scoreEvent: "play", pointer: VS.score.pointer });
        };
        VS.control.pauseCallback = function() {
            VS.WebSocket.send({ cid: ws.cid, scoreEvent: "pause", pointer: VS.score.pointer });
        };
        VS.control.stopCallback = function() {
            VS.WebSocket.send({ cid: ws.cid, scoreEvent: "stop" });
        };
        VS.control.stepCallback = function() {
            VS.WebSocket.send({ cid: ws.cid, scoreEvent: "step", pointer: VS.score.pointer });
        };
    }

    function logMessage(msg) {
        document.getElementById("ws-log").innerHTML = msg; // TODO stash element
    }

    ws.send = function(data) {
        try {
            socket.send(JSON.stringify(data));
        } catch(err) {
            logMessage("Send error: " + err);
        }
    };

    connect();

    return ws;
})();
