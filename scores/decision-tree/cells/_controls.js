/**
 * Score
 */
VS.score.stopCallback = clearChoices;

VS.score.stepCallback = function () {
    if (VS.score.pointer === 0) {
        clearChoices();
    } else if (VS.score.pointer < VS.score.getLength() - 1) {
        updateChoices();
    }
};

/**
 * Keyboard
 */
function keydownListener(event) {
    if (event.defaultPrevented) { return; }

    switch (event.keyCode) {
    case 38:
        selectCell("top");
        break;
    case 40:
        selectCell("bottom");
        break;
    default:
        return;
    }
    event.preventDefault();
}
window.addEventListener("keydown", keydownListener, true);

/**
 * Websocket
 */
VS.WebSocket.messageCallback = function(data) {
    var type = data[0];
    var msg = data[2];

    if (type === "ws" && msg === "connections") {
        score.partWeight = (1 / data[3]) * score.weightScale;
        debugChoices();
    } else if (type === "choice" && data[1] !== VS.WebSocket.cid) {
        params.updateWeights(msg, score.partWeight);
        debugChoices();
    }
};

VS.WebSocket.connect();
