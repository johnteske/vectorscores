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
                VS.WebSocket.send({ type: "score", scoreEvent: "play", pointer: VS.score.pointer });
            };
            VS.control.pauseCallback = function () {
                VS.WebSocket.send({ type: "score", scoreEvent: "pause", pointer: VS.score.pointer });
            };
            VS.control.stopCallback = function () {
                VS.WebSocket.send({ type: "score", scoreEvent: "stop" });
            };
            VS.control.stepCallback = function () {
                VS.WebSocket.send({ type: "score", scoreEvent: "step", pointer: VS.score.pointer });
            };
        }
    }

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

                    if (data.type === "ws" && data.content === "connected") {
                        ws.cid = data.cid;
                    } else if (data.type === "ws" && data.content === "connections") {
                        log("Open, " + data.connections + " connection(s) total");
                    }

                    // if not sent by self
                    if (data.type === "score" && data.cid !== ws.cid) {
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
                                VS.score.updatePointer(data.pointer);
                                scrollCallback(); // TODO -- hardcoded for ad;sr currently
                                break;
                        }
                    }
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
        data.cid = ws.cid; // attach client ID to all
        try {
            socket.send(JSON.stringify(data));
        } catch (err) {
            log("Send error: " + err);
        }
    };

    return ws;
})();
