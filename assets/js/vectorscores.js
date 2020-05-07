(function () {
    'use strict';

    /**
     * Get query parameter value from query string, by query parameter key
     * @param {string} param : query parameter key
     * @param {string} [url=window.location.href] : URL string to extract query parameter value from
     * @returns {string} : query parameter value
     */
    function getQueryString(param, url) {
        var href = url || window.location.href;
        var match = new RegExp('[?&]' + param + '=([^&#]*)', 'i').exec(href);

        return match ? match[1] : null;
    }
    /**
     * Make query string
     * @param {object} params : query parameters as key-value pairs
     * @returns {string} : query string, joined by '&'
     */
    function makeQueryString(params) {
        return Object.keys(params).map(function(key) {
            return key + '=' + params[key];
        }).join('&');
    }
    /**
     * Define constant as function (used in D3-idiomatic modules)
     * @param {*} val : value to set as constant
     * @returns {*} : value
     */
    function constant(val) {
        return function constant() {
            return val;
        };
    }
    /**
     * Generate unique id
     * @returns {number} : id
     */
    const id = (function() {
        var id = 0;

        return function() {
            return id++;
        };
    }());

    var util = /*#__PURE__*/Object.freeze({
        __proto__: null,
        getQueryString: getQueryString,
        makeQueryString: makeQueryString,
        constant: constant,
        id: id
    });

    /**
     * Get random float between min and max, excluding max
     * @param {number} min : lower limit
     * @param {number} max : upper limit (excluded)
     * @returns {number} float value between min and max, excluding max
     */
    const getRandExcl = function(min, max) {
        return Math.random() * (max - min) + min;
    };

    /**
     * Get random integer, inclusive
     * NOTE expects integer input
     * @param {number} min : lower limit
     * @param {number} max : upper limit (included)
     * @returns {number} integer value between min and max, including max
     */
    const getRandIntIncl = function(min, max) {
        return Math.floor(VS.getRandExcl(min, max + 1));
    };

    /**
     * Get random item from an array, using uniform distribution
     * @param {array} items
     * @returns {*}
     */
    const getItem = function(items) {
        return items[Math.floor(Math.random() * items.length)];
    };

    /**
     * Get random item from an array, using weighted distribution
     * @param {array} items
     * @returns {*}
     */
    const getWeightedItem = function(items, weights) {
        var totalWeight = weights.reduce(function(a, b) {
            return a + b;
        });

        var rand = VS.getRandExcl(0, totalWeight);

        for (var i = 0, acc = 0; i < items.length; i++) {
            acc += weights[i];

            if (rand <= acc) {
                return items[i];
            }
        }
    };

    /**
     * Constrain a value to the specified limits
     * @param {number} val
     * @param {number} min
     * @param {number} val
     * @returns {number}
     */
    const clamp = function(val, min, max) {
        return Math.min(Math.max(val, min), max);
    };

    /**
     * Normalize a value with the specified limits
     * @param {number} val
     * @param {number} min
     * @param {number} val
     * @returns {number}
     */
    const normalize = function(val, min, max) {
        return (val - min) / (max - min);
    };

    /**
     * Modulo function
     * @param {number} val
     * @param {number} mod
     * @returns {number}
     */
    const mod = function(val, mod) {
        return ((val % mod) + mod) % mod;
    };

    var math = /*#__PURE__*/Object.freeze({
        __proto__: null,
        getRandExcl: getRandExcl,
        getRandIntIncl: getRandIntIncl,
        getItem: getItem,
        getWeightedItem: getWeightedItem,
        clamp: clamp,
        normalize: normalize,
        mod: mod
    });

    /**
     * Factory function to create methods to add and trigger hooks
     * @param {array} keys : keys of hooks
     */
    const createHooks = function(keys) {

        var hooks = {};

        /**
         * Initialize dictionary
         */
        var dictionary = keys.reduce(function(target, key) {
            target[key] = [];
            return target;
        }, {});

        /**
         * Add hook
         * @param {string} hook : key of hook to add to
         * @param {function} fn : function to add to hook
         */
        hooks.add = function(hook, fn) {
            if (dictionary[hook]) {
                dictionary[hook].push(fn);
            } else {
                throw new Error('[hooks#add] ' + hook + ' is not a registered hook');
            }
        };

        /**
         * Call all functions for a given hook
         * @param {string} hook : key of hook to trigger
         * @param {array} args : array of arguments to apply
         */
        hooks.trigger = function(hook, args) {
            dictionary[hook].forEach(function(fn) {
                fn.apply(null, args);
            });
        };

        return Object.freeze(hooks);
    };

    var hooks = /*#__PURE__*/Object.freeze({
        __proto__: null,
        createHooks: createHooks
    });

    const layout = (function() {
        var layout = {};

        var header = document.getElementById('score-header');
        var footer = document.getElementById('score-footer');

        function makeClassSetter(className) {
            return function() {
                header.className = className;
                footer.className = className;
            };
        }

        layout.show = makeClassSetter('show');
        layout.hide = makeClassSetter('hide');

        function addLayoutInteraction(element) {
            element.addEventListener('click', layout.show, false);
            element.addEventListener('mouseover', layout.show, false);
            element.addEventListener('mouseout', layout.hide, false);
        }

        addLayoutInteraction(header);
        addLayoutInteraction(footer);

        // Hide layout when interacting with score
        document.getElementsByTagName('main')[0].addEventListener('click', layout.hide, false);

        return layout;
    })();

    var layout$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        layout: layout
    });

    const score = (function() {

        var events = [];

        var allTimeouts = [];
        function clearAllTimeouts() {
            allTimeouts.forEach(function(t) {
                clearTimeout(t);
            });
        }

        var isPlaying = false;
        var pointer = 0;

        // Schedule this event (if defined)
        function schedule(time, func, params) {
            (typeof func === 'function') && allTimeouts.push(setTimeout(func, time, params));
        }

        // Add a hook for the stop event, triggered after a score ends or by the user
        var hooks = createHooks(['stop']);

        function updatePointer(index) {
            pointer = index;
            VS.control.pointer.value = index;
        }

        function playEvent(index) {
            VS.score.updatePointer(index);

            var thisEvent = events[index];

            // Execute this event (if defined)
            if (typeof thisEvent.action === 'function') {
                // TODO don't force first argument to be index
                thisEvent.action.apply(null, thisEvent.parameters);
            }

            // Schedule next event
            if (index < VS.score.getLength() - 1) {
                var timeToNext = events[index + 1].time - thisEvent.time;
                schedule(timeToNext, playEvent, index + 1);
            } else {
                VS.score.stop(); // TODO should the score automatically stop? or should the composer call this when ready?
            }
        }

        return {
            add: function(time, fn, parameters) {
                events.push({
                    time: time,
                    action: fn,
                    parameters: parameters
                });
            },
            getLength: function() { return events.length; },
            isPlaying: function() { return isPlaying; },
            getPointer: function() { return pointer; },
            pointerAtLastEvent: function() {
                return pointer === (this.getLength() - 1);
            },
            preroll: 0, // delay before play
            hooks: hooks,
            play: function() {
                isPlaying = true;
                schedule(VS.score.preroll, playEvent, pointer);
                VS.control.set('playing');
                VS.layout.hide();
            },
            pause: function() {
                isPlaying = false;
                clearAllTimeouts();
                VS.control.setStateFromPointer();
                VS.layout.show();
            },
            stop: function() {
                isPlaying = false;
                clearAllTimeouts();
                VS.score.updatePointer(0);
                VS.control.set('firstStep');
                VS.layout.show();
                hooks.trigger('stop');
            },
            schedule: schedule,
            updatePointer: updatePointer
        };
    })();

    var score$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        score: score
    });

    const scoreOptions = (function() {

        var options = {};
        var elements = {};

        function updateElements() {
            for (var key in elements) {
                elements[key].set(options[key]);
            }
        }

        /**
         * Set options from value, including nested objects
         * TODO this currently relies on a default being set for objects
         * @param {object} obj
         * @param {string} [url]
         */
        function setFromObject(obj, url) {
            var value;

            for (var key in obj) {
                if (typeof obj[key] === 'object' && obj[key] !== null) {
                    setFromObject(obj[key], url);
                } else {
                    value = VS.getQueryString(key, url);

                    if (value) {
                        obj[key] = value;
                    }
                }
            }
        }

        return {
            add: function(key, defaults, element) {
                options[key] = defaults;
                elements[key] = element;
            },
            setFromQueryString: function(url) {
                setFromObject(options, url);
                updateElements();

                return options;
            }
        };
    })();

    var scoreOptions$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        scoreOptions: scoreOptions
    });

    const control = (function() {

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
            { key: 'back', flag: 8},
            { key: 'stop', flag: 4},
            { key: 'fwd', flag: 2}
        ];

        // back, stop, fwd, play/pause
        var states = {
            playing: 4, // 0100,
            firstStep: 3, // 0011,
            step: 15, // 1111,
            lastStep: 13 // 1101
        };

        control.set = function(stateKey) {
            var state = states[stateKey];

            controlMap.forEach(function(pair) {
                control[pair.key].disabled = (state & pair.flag) === 0;
            });

            var pauseClassMethod = (state & 1) ? 'remove' : 'add';
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
        var hooks = control.hooks = createHooks(['play', 'pause', 'stop', 'step']);

        function keydownListener(event) {
            if (event.defaultPrevented || event.metaKey) { return; }

            switch (event.key) {
            case ' ':
                playPause();
                break;
            case 'h':
            case 'k':
            case 'ArrowLeft':
                !VS.score.isPlaying() && decrementPointer();
                break;
            case 'l':
            case 'j':
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

    var controls = /*#__PURE__*/Object.freeze({
        __proto__: null,
        control: control
    });

    const enableModal = function(idPrefix) {
        var modal = document.getElementById(idPrefix + '-modal');
        var openTrigger = document.getElementById(idPrefix + '-open');
        var closeTrigger = document.getElementById(idPrefix + '-close');
        var overlay = document.getElementById('score-modal-overlay'); // wraps all score modals

        function openModal() {
            showModalAndOverlay(true);

            VS.score.pause();
            VS.layout.show();
            VS.control.listenForKeydown(false);

            listenForModalEvents(true);
        }

        function closeModal() {
            showModalAndOverlay(false);

            VS.layout.hide();
            VS.control.listenForKeydown(true);

            listenForModalEvents(false);
        }

        function showModalAndOverlay(shouldShow) {
            var method = shouldShow ? 'add' : 'remove';

            overlay.classList[method]('show');
            modal.classList[method]('show');
        }

        function listenForModalEvents(shouldListen) {
            var method = shouldListen ? 'addEventListener' : 'removeEventListener';

            closeTrigger[method]('click', closeModal, true);
            window[method]('click', clickListener, true);
            window[method]('keydown', keydownListener, true);
        }

        function clickListener(event) {
            (event.target === overlay) && closeModal();
        }

        function keydownListener(event) {
            if (event.defaultPrevented) { return; }

            switch (event.key) {
            case 'Escape':
                closeModal();
                break;
            default:
                return;
            }

            event.preventDefault();
        }

        openTrigger.addEventListener('click', openModal, true);
    };

    // TODO separate definition from instantiation
    if (document.getElementById('score-info-open')) {
        enableModal('score-info');
    }
    if (document.getElementById('score-options-open')) {
        enableModal('score-options');
    }

    var modals = /*#__PURE__*/Object.freeze({
        __proto__: null,
        enableModal: enableModal
    });

    window.VS = {
        ...util,
        ...math,
        ...hooks,
        ...layout$1,
        ...score$1,
        ...scoreOptions$1,
        ...controls,
        ...modals
    };

}());
