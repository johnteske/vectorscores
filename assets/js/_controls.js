VS.control = (function() {

    function createScoreControl(id, clickHandler) {
        var element = document.getElementById(id);
        element.onclick = clickHandler;

        function setDisabled(isDisabled) {
            return function() {
                return element.disabled = isDisabled;
            };
        }

        return {
            element: element,
            enable: setDisabled(false),
            disable: setDisabled(true)
        };
    }

    function playPause() {
        if (!VS.score.playing) {
            VS.score.play();
            hooks.trigger('play');
        } else {
            VS.score.pause();
            hooks.trigger('pause');
        }
    }

    function stop() {
        VS.score.stop();
        hooks.trigger('stop');
    }

    var incrementPointer = createPointerStepper(1);
    var decrementPointer = createPointerStepper(-1);

    // Step pointer if not playing
    function createPointerStepper(steps) {
        return function() {
            if (VS.score.playing) {
                return;
            }

            VS.score.updatePointer(VS.clamp(VS.score.pointer + steps, 0, VS.score.getLength() - 1));
            VS.control.updateStepButtons();
            hooks.trigger('step');
        };
    }

    var playControl = createScoreControl('score-play', playPause);

    // TODO set initial state, including starting .play class (currently set in html)
    playControl.setPlay = function() {
        this.element.classList.add('play');
        this.element.classList.remove('pause');
    };

    playControl.setPause = function() {
        this.element.classList.remove('play');
        this.element.classList.add('pause');
    };

    var stopControl = createScoreControl('score-stop', stop);
    var backControl = createScoreControl('score-back', decrementPointer);

    // Set initial control states
    stopControl.disable();
    backControl.disable();

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
            decrementPointer();
            break;
        case 'ArrowRight':
        case 39:
            incrementPointer();
            break;
        case 'Escape':
        case 27:
            stop();
            break;
        default:
            return;
        }

        event.preventDefault();
    };

    var hooks = VS.createHooks(['play', 'pause', 'stop', 'step']);

    // TODO separate definition from instantiation
    window.addEventListener('keydown', keydownListener, true);

    return {
        play: playControl,
        stop: stopControl,
        fwd: createScoreControl('score-fwd', incrementPointer),
        back: backControl,
        hooks: hooks,
        pointer: createScoreControl('score-pointer', VS.score.pause),
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
