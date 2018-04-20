VS.control = (function() {

    function ScoreControl(id, fn) {
        this.element = document.getElementById(id);
        this.element.onclick = fn;
    }
    ScoreControl.prototype.enable = function() {
        this.element.disabled = false;
    };
    ScoreControl.prototype.disable = function() {
        this.element.disabled = true;
    };

    function playPause() {
        if (!VS.score.playing) {
            VS.score.play();
            VS.cb(VS.control.playCallback);
        } else {
            VS.score.pause();
            VS.cb(VS.control.pauseCallback);
        }
    }

    function stop() {
        VS.score.stop();
        VS.cb(VS.control.stopCallback);
    }

    function stepPointer(steps) {
        if (!VS.score.playing) { // don't allow skip while playing, for now
            VS.score.updatePointer(VS.clamp(VS.score.pointer + steps, 0, VS.score.getLength() - 1));
            VS.control.updateStepButtons();
            hooks.trigger('step');
        }
    }

    var playControl = new ScoreControl('score-play', playPause);

    playControl.setPlay = function() {
        d3.select('g#play').classed('hide', 0);
        d3.select('g#pause').classed('hide', 1);
    };
    playControl.setPause = function() {
        d3.select('g#play').classed('hide', 1);
        d3.select('g#pause').classed('hide', 0);
    };

    var keydownListener = function(event) {
        if (event.defaultPrevented || event.metaKey) {
            return;
        }

        var keyPressed = event.key || event.keyCode;

        switch (keyPressed) {
        case ' ':
        case 32:
            playPause();
            break;
        case 'ArrowLeft':
        case 37:
            stepPointer(-1);
            break;
        case 'ArrowRight':
        case 39:
            stepPointer(1);
            break;
        case 'Escape':
        case 27:
            stop();
            break;
        // case "/":
        // case 191:
        //     document.getElementById("score-pointer").focus();
        //     break;
        default:
            return;
        }
        event.preventDefault();
    };

    var stopControl = new ScoreControl('score-stop', stop);
    var backControl = new ScoreControl('score-back', function() { stepPointer(-1); });

    // Set initial control states
    stopControl.disable();
    backControl.disable();

    var hooks = VS.createHooks(['play', 'pause', 'stop', 'step']);

    window.addEventListener('keydown', keydownListener, true);

    return {
        playCallback: undefined,
        pauseCallback: undefined,
        stopCallback: undefined,
        stepCallback: [],
        play: playControl,
        stop: stopControl,
        fwd: new ScoreControl('score-fwd', function() { stepPointer(1); }),
        back: backControl,
        hooks: hooks,
        pointer: new ScoreControl('score-pointer', VS.score.pause),
        updateStepButtons: function() {
            if (VS.score.pointer === 0) {
                this.back.disable();
                this.fwd.enable();
            } else if (VS.score.pointer === (VS.score.getLength() - 1)) {
                this.back.enable();
                this.fwd.disable();
            } else {
                this.back.enable();
                this.fwd.enable();
            }
        },
        keydownListener: keydownListener
    };

})();
