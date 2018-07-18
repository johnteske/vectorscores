VS.control = (function() {

    var control = {};

    /**
     * Compose callbacks
     */
    function createScoreEventCallback(scoreEvent) {
        return function() {
            VS.score[scoreEvent]();
            hooks.trigger(scoreEvent);
        };
    }

    var play = createScoreEventCallback('play');
    var pause = createScoreEventCallback('pause');
    var stop = createScoreEventCallback('stop');

    function playPause() {
        VS.score.isPlaying() ? pause() : play();
    }

    function createStepCallback(steps) {
        return function() {
            var pointer = VS.clamp(VS.score.getPointer() + steps, 0, VS.score.getLength() - 1);
            VS.score.updatePointer(pointer);

            control.setStateFromPointer();

            hooks.trigger('step');
        };
    }

    var incrementPointer = createStepCallback(1);
    var decrementPointer = createStepCallback(-1);

    /**
     * Create controls
     */
    function createScoreControl(id, clickHandler) {
        var element = document.getElementById(id);
        element.addEventListener('click', clickHandler, false);
        return element;
    }

    control.back = createScoreControl('score-back', decrementPointer);
    control.play = createScoreControl('score-play', playPause);
    control.stop = createScoreControl('score-stop', stop);
    control.fwd = createScoreControl('score-fwd', incrementPointer);
    control.pointer = createScoreControl('score-pointer');

    /**
     * Control states (as enabled states)
     */
    var controlMap = [
        { key: 'back', flag: 16},
        { key: 'stop', flag: 8},
        { key: 'fwd', flag: 4}
    ];
    var playPauseFlag = 2;

    // TODO remove pause
    var states = {
        playing: 9, // 01001,
        firstStep: 6, // 00110,
        step: 30, // 11110,
        lastStep: 26 // 11010
    };

    control.set = function(stateKey) {
        var state = states[stateKey];

        controlMap.forEach(function(pair) {
            control[pair.key].disabled = (state & pair.flag) === 0;
        });

        var pauseClassMethod = (state & playPauseFlag) ? 'remove' : 'add';
        control.play.classList[pauseClassMethod]('pause');
    };

    control.setStateFromPointer = function() {
        var state = VS.score.getPointer() === 0 ? 'firstStep' :
            VS.score.pointerAtLastEvent() ? 'lastStep' :
            'step';

        this.set(state);
    };

    /**
     * Hooks and keyboard control
     */
    var hooks = control.hooks = VS.createHooks(['play', 'pause', 'stop', 'step']);

    function keydownListener(event) {
        if (event.defaultPrevented || event.metaKey) { return; }

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
    }

    control.listenForKeydown = function(shouldListen) {
        var method = shouldListen ? 'addEventListener' : 'removeEventListener';
        window[method]('keydown', keydownListener, true);
    };

    /**
     * Init
     */
    control.set('firstStep');
    control.listenForKeydown(true);

    return control;

})();
