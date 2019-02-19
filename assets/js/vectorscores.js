import * as util from './vs/helpers.util.js';
import * as math from './vs/helpers.math.js';
import * as hooks from './vs/hooks.js';
import * as layout from './vs/layout.js';
import * as score from './vs/score.js';
import * as scoreOptions from './vs/score-options.js';
import * as controls from './vs/controls.js';
import * as modals from './vs/modals.js';

window.VS = {
    ...util,
    ...math,
    ...hooks,
    ...layout,
    ...score,
    ...scoreOptions,
    ...controls,
    ...modals
};
