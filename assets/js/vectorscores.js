import * as util from './vs/helpers.util.js';
import * as math from './vs/helpers.math.js';
import * as hooks from './vs/hooks.js';
import * as layout from './vs/layout.js';

window.VS = {
    ...util,
    ...math,
    ...hooks,
    ...layout
};

/*
require('score')
require('score.options')
require('controls')
require('modals')
*/
