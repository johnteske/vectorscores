VS.control = (function() {

    var control = {};

    function createScoreControl(id, clickHandler) {
        var element = document.getElementById(id);
        element.addEventListener('click', clickHandler, false);
        return element;
    }

    function playPause() {
        if (!VS.score.isPlaying()) {
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
            var pointer = VS.clamp(VS.score.getPointer() + steps, 0, VS.score.getLength() - 1);
            VS.score.updatePointer(pointer);

            control.setStateFromPointer();

            hooks.trigger('step');
        };
    }

    control.setStateFromPointer = function() {
        var state = VS.score.getPointer() === 0 ? 'firstStep' :
            VS.score.pointerAtLastEvent() ? 'lastStep' :
            'step';

        this.set(state);
    };

    var hooks = control.hooks = VS.createHooks(['play', 'pause', 'stop', 'step']);

    control.back = createScoreControl('score-back', decrementPointer);
    control.play = createScoreControl('score-play', playPause);
    control.stop = createScoreControl('score-stop', stop);
    control.fwd = createScoreControl('score-fwd', incrementPointer);
    control.pointer = createScoreControl('score-pointer');

    // Enabled state of controls
    var states = {% include_relative _control-states.json %};

    var controlsToToggle = ['back', 'stop', 'fwd'];
    var iconsToToggle = ['play', 'pause'];

    control.set = function(stateKey) {
        var state = states[stateKey];

        controlsToToggle.forEach(function(controlName) {
            control[controlName].disabled = !state[controlName];
        });

        iconsToToggle.forEach(function(controlName) {
            var method = state[controlName] ? 'add' : 'remove';
            control.play.classList[method](controlName);
        });
    };

    control.keydownListener = function(event) {
        if (event.defaultPrevented || event.metaKey) {
            return;
        }

        switch (event.key) {
        case ' ':
            playPause();
            break;
        case 'ArrowLeft':
            !VS.score.isPlaying() && decrementPointer();
            break;
        case 'ArrowRight':
            !VS.score.isPlaying() && incrementPointer();
            break;
        case 'Escape':
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
