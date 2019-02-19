import * as util from './vs/helpers.util.js';
import * as math from './vs/helpers.math.js';
import * as hooks from './vs/hooks.js';
import * as layout from './vs/layout.js';
import * as score from './vs/score.js';

window.VS = {
    ...util,
    ...math,
    ...hooks,
    ...layout,
    ...score
};

/*
require('score.options')
require('controls')
require('modals')
*/
