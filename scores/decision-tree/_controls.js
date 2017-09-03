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
    if (data.type === "ws" && data.content === "connections") {
        score.partWeight = (1 / data.connections) * score.weightScale;
        debugChoices();
    } else if (data.type === "choice" && data.cid !== VS.WebSocket.cid) {
        params.updateWeights(data.content, score.partWeight);
        debugChoices();
    }
};

VS.WebSocket.connect();
