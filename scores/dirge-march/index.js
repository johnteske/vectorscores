---
layout: compress-js
---
/**
 * TODO Don't remove pitch classes from data when deduplicating,
 * instead hide them during rendering. Keeping the data will allow the
 * better line cloud rendering (also TODO).
 */

// Musical constants that define the piece
var config = {
    semitoneTransposition: 2,
    numberOfPercussionParts: 2,
    maxRhythmsPerBar: 2
};

// Display constants
var layout = {
    container: {
        height: null, // set after render for resizing/scaling
        scale: 1
    },
    wrapper: {
        y: 105
    },
    cueIndicator: {
        y: 15
    },
    pitched: {
        y: 0,
        globjects: {
            height: 127
        }
    },
    percussion: {
        y: 220,
    },
    scaleTime: function(x) {
        return x * 5;
    },
    barPadding: 6
};

var dynamics = VS.dictionary.Bravura.dynamics;

// Wrap in IIFE to aid in linting
var rawGlobjects = (function() {
    return {% include_relative _proto-globjects.json %};
}());

{% include_relative _generate-globjects.js %}
var globjects = generateGlobjects(rawGlobjects);
var retrogradeGlobjects = generateRetrogradeGlobjects(globjects);

{% include_relative _rhythms.js %}

// Wrap in IIFE to aid in linting
var rawScore = (function() {
    var raw = {% include_relative _score.json %};

    return raw.map(function(bar, i) {
        bar.index = i;
        return bar;
    });
}());

var barTimes = rawScore.map(function(d) {
    return d.time;
})

{% include_relative _generate-parts.js %};
var parts = generatePartsFromRawScore(rawScore);

{% include_relative _draw-crescendos.js %}

{% include_relative _pitched-part.js %}
{% include_relative _percussion-part.js %}

{% include_relative _options.js %}
config.semitoneTransposition += scoreOptions.transposition;

{% include_relative _cue.js %}

var svg = d3.select('svg');
svg.append('defs');

// Static group, for resizing/scaling calculations
var container = svg.append('g');

var wrapper = container.append('g')
    .attr('class', 'wrapper');

function textAnchor(t) {
    var a = 'middle';

    if (t === 0) {
        a = 'start';
    } else if (t === 1) {
        a = 'end';
    }

    return a;
}

// TODO add vinculum U+0305 to .333 and .666 bar times
// -- or add tpans with optional .style('text-decoration', 'overline')
function renderLayout() {
    var barTimeGroup = wrapper.append('g')
        .attr('class', 'bar-times');

    barTimeGroup.selectAll('line')
        .data(barTimes)
        .enter()
        .append('line')
        .attr('x1', function(d, i) {
            return getXByScoreIndex(i);
        })
        .attr('x2', function(d, i) {
            return getXByScoreIndex(i);
        })
        .attr('y1', 0) // TODO
        .attr('y2', layout.percussion.y) // TODO
        .attr('stroke', 'black')
        .attr('stroke-opacity', 0.25);

    barTimeGroup.selectAll('text')
        .data(barTimes)
        .enter()
        .append('text')
        .style('font-family', 'serif')
        .style('font-style', 'italic')
        .attr('dy', '-3em')
        .attr('x', function(d, i) {
            return getXByScoreIndex(i);
        })
        .text(function(d) {
            return d + '\u2033';
        });
}

/**
 *
 */
{% include_relative _fill-globject.js %}
{% include_relative _calculate-joining-symbol-points.js %}
{% include_relative _draw-pitch-class-layer.js %}
{% include_relative _append-dynamics.js %}

function renderPitched() {
    var pitchedGroup = wrapper.append('g')
        .attr('class', 'pitched-part')
        .attr('transform', 'translate(' + 0 + ',' + layout.pitched.y + ')');

    pitchedGroup.call(pitchedPart.init);
    pitchedPart.draw();
}

function renderPercussion() {
    var percussionGroup = wrapper.append('g')
        .attr('class', 'percussion-parts')
        .attr('transform', 'translate(' + 0 + ',' + layout.percussion.y + ')');

    percussionGroup.call(percussionPart.init);
    percussionPart.draw();
}

/**
 * Resize
 */
var viewCenter;
function resize() {
    var main = d3.select('main');

    // TODO put global width, height in properties so these can be better named
    var w = parseInt(main.style('width'), 10);
    var h = parseInt(main.style('height'), 10);

    // TODO manually added 105 of "bottom padding"
    layout.container.scale = h / (layout.container.height + 15);

    container.attr('transform', 'scale(' + layout.container.scale + ')')

    viewCenter = (w / layout.container.scale) * 0.5;

    setScorePosition(0);
    cueIndicator.positionToCenter();
}

d3.select(window).on('resize', resize);

function getXByScoreIndex(i) {
    // Add offset to give rest more space
    var offset = (i > 7) ? 18 : 0;

    var padding = i * layout.barPadding;

    return offset + layout.scaleTime(barTimes[i]) + padding;
}

function scrollScoreToIndex(index, duration) {
    var x = viewCenter - getXByScoreIndex(index);

    wrapper
        .transition()
        .ease(d3.easeLinear)
        .duration(duration)
        .attr('transform', 'translate(' + x + ',' + layout.wrapper.y + ')');
}

function scrollToNextBar(index, duration) {
    scrollScoreToIndex(index + 1, duration);
}

function setScorePosition(duration) {
    var dur = (typeof duration === 'undefined') ? 300 : duration;
    scrollScoreToIndex(VS.score.pointer, dur);
}

/**
 * Populate score
 */
for (var i = 0; i < barTimes.length; i++) {
    var duration = (barTimes[i + 1] - barTimes[i]) * 1000;
    VS.score.add(barTimes[i] * 1000, scrollToNextBar, [i, duration]);
}

/**
 * Initialize score
 */
d3.select(window).on('load', function() {
    renderLayout();
    cueIndicator.initAndRender();
    renderPitched();
    renderPercussion();
    layout.container.height = container.node().getBBox().height;
    resize();
});

/**
 * Score controls
 */
VS.control.hooks.add('play', prerollAnimateCue);

VS.control.hooks.add('stop', setScorePosition);
VS.control.hooks.add('step', setScorePosition);
VS.control.hooks.add('pause', setScorePosition);
