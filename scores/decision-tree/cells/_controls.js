/**
 * Score callbacks
 * Choices should be cleared so new choices can be loaded and selected on play
 */
VS.score.hooks.add('pause', clearChoices);
VS.score.hooks.add('stop', clearChoices);

/**
 * Keyboard
 */
function keydownListener(event) {
    if (event.defaultPrevented) { return; }

    switch (event.keyCode) {
    case 38:
        selectCell('top');
        break;
    case 40:
        selectCell('bottom');
        break;
    default:
        return;
    }
    event.preventDefault();
}
window.addEventListener('keydown', keydownListener, true);

/**
 * Websocket
 */
VS.WebSocket.messageCallback = function(data) {
    var cid = data[0];
    var type = data[1];
    var msg = data[2];

    if (type === 'ws' && msg === 'connections') {
        score.partWeight = (1 / data[3]) * score.weightScale;
        debugChoices();
    } else if (type === 'choice' && cid !== VS.WebSocket.cid) {
        params.updateWeights(msg, score.partWeight);
        debugChoices();
    }
};

VS.WebSocket.connect();
