var socket,
    cid, // client id
    host = "ws://" + location.hostname + ":4001";

function connect() {
    try {
        socket = new WebSocket(host);

        socket.onopen = function() {
            addMessage("Socket Status: " + socket.readyState + " (open)");
        }

        socket.onclose = function() {
            addMessage("Socket Status: " + socket.readyState + " (closed)");
        }

        socket.onmessage = function(msg) {
            try {
                var data = JSON.parse(msg.data);
                if (data.type === 'ws' && data.content === 'connected') {
                    cid = data.cid;
                    console.log('cid SET', cid);
                }
                // if not sent by self
                if (data.cid !== cid) {
                    switch(data.scoreEvent) {
                        case 'play':
                            VS.score.play();
                            break;
                        case 'pause':
                            VS.score.pause();
                            break;
                        case 'stop':
                            VS.score.stop();
                            break;
                        case 'step':
                            updatePointer(data.pointer); // TODO add to VS, not global
                            break;
                    }
                }
            }
            catch (err) {
                console.log(err);
            }
            addMessage("Received: " + msg.data);
        }
    } catch(exception) {
        addMessage("Error: " + exception);
    }
}

function addMessage(msg) {
    document.getElementById("ws-log").innerHTML = msg;
}

function send(data) {
    try {
        socket.send(JSON.stringify(data));
        // addMessage("Sent: " + text)
    } catch(exception) {
        // addMessage("Failed To Send")
    }
}

connect();

// socket.close(); // disconnect

VS.control.playCallback = function() {
    send({ cid: cid, scoreEvent: 'play', pointer: VS.score.pointer });
}
VS.control.pauseCallback = function() {
    send({ cid: cid, scoreEvent: 'pause', pointer: VS.score.pointer });
}
VS.control.stopCallback = function() {
    send({ cid: cid, scoreEvent: 'stop' });
}
VS.score.stopCallback = function() {
    d3.selectAll(".event-span").attr("class", "event-span"); // force this class only
}
VS.control.stepCallback = function() {
    send({ cid: cid, scoreEvent: 'step', pointer: VS.score.pointer });
}