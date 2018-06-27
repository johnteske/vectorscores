// TODO set states:
// - first event state
//   - including starting .play class (currently set in html)
//   - back and stop buttons disabled
// - last event state
// - all other events
// - also play, pause states, to remove from VS.score

VS.control = (function() {

    var control = {};

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

    var hooks = control.hooks = VS.createHooks(['play', 'pause', 'stop', 'step']);

    control.back = createScoreControl('score-back', decrementPointer);
    control.back.disable(); // TODO

    control.play = createScoreControl('score-play', playPause);

    control.play.setPlay = function() {
        this.element.classList.add('play');
        this.element.classList.remove('pause');
    };

    control.play.setPause = function() {
        this.element.classList.remove('play');
        this.element.classList.add('pause');
    };

    control.stop = createScoreControl('score-stop', stop);
    control.stop.disable(); // TODO

    control.fwd = createScoreControl('score-fwd', incrementPointer);

    control.pointer = createScoreControl('score-pointer', VS.score.pause);

    control.updateStepButtons = function() {
        if (VS.score.pointer === 0) {
            this.back.disable();
            this.fwd.enable();
        } else if (VS.score.pointerAtLastEvent()) {
            this.back.enable();
            this.fwd.disable();
        } else {
            this.back.enable();
            this.fwd.enable();
        }
    };

    control.keydownListener = function(event) {
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

    // TODO separate definition from instantiation
    window.addEventListener('keydown', control.keydownListener, true);

    return control;

})();
