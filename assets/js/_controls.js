VS.control = (function() {

    var control = {};

    function createScoreControl(id, clickHandler) {
        var element = document.getElementById(id);
        element.onclick = clickHandler;

        return {
            element: element
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

            var pointer = VS.clamp(VS.score.pointer + steps, 0, VS.score.getLength() - 1);
            VS.score.updatePointer(pointer);

            control.setStateFromPointer();

            hooks.trigger('step');
        };
    }

    control.setStateFromPointer = function() {
        this.set(getStepStateFromPointer());
    };

    function getStepStateFromPointer() {
        return VS.score.pointer === 0 ? 'firstStep' :
            VS.score.pointerAtLastEvent() ? 'lastStep' :
            'step';
    }

    var hooks = control.hooks = VS.createHooks(['play', 'pause', 'stop', 'step']);

    control.back = createScoreControl('score-back', decrementPointer);

    control.play = createScoreControl('score-play', playPause);
    control.play.showIcon = function(iconName, state) {
        var method = state ? 'add' : 'remove';
        this.element.classList[method](iconName);
    };

    control.stop = createScoreControl('score-stop', stop);
    control.fwd = createScoreControl('score-fwd', incrementPointer);
    control.pointer = createScoreControl('score-pointer', VS.score.pause);

    // Enabled state of controls
    var states = {
        'playing': {
            back: false,
            play: false,
            pause: true,
            stop: true,
            fwd: false
        },
        'firstStep': {
            back: false,
            play: true,
            pause: false,
            stop: false,
            fwd: true
        },
        'step': {
            back: true,
            play: true,
            pause: false,
            stop: true,
            fwd: true
        },
        'lastStep': {
            back: true,
            play: true,
            pause: false,
            stop: true,
            fwd: false
        }
    };

    control.set = function(stateKey) {
        var state = states[stateKey];

        Object.keys(state).forEach(function(controlName) {
            var isEnabled = state[controlName];

            if (controlName === 'play' || controlName === 'pause') {
                control.play.showIcon(controlName, isEnabled);
            } else {
                control[controlName].element.disabled = !isEnabled;
            }
        });
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
    control.set('firstStep');
    window.addEventListener('keydown', control.keydownListener, true);

    return control;

})();
