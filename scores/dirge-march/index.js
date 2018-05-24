---
layout: compress-js
---

// Musical constants that define the piece
var config = {
    semitoneTransposition: 2,
    numberOfPercussionParts: 2,
    maxRhythmsPerBar: 2
};

// Display constants
var layout = {
    pitched: {
        y: 0
    },
    percussion: {
        y: 220,
    },
    scaleTime: function(x) {
        return x * 5;
    }
};

// TODO each globject should have its own height and y position
var globjectHeight = 90;

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
    return {% include_relative _score.json %};
}());

var barTimes = rawScore.map(function(d) {
    return d.time;
})

{% include_relative _generate-parts.js %};
var parts = generatePartsFromRawScore(rawScore);

{% include_relative _pitched-part.js %}
{% include_relative _percussion-part.js %}

{% include_relative _options.js %}
config.semitoneTransposition += scoreOptions.transposition;

var svg = d3.select('svg');

var wrapper = svg.append('g')
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

// TODO also add bar ticks, for reference, like in ad;sr
// TODO add vinculum U+0305 to .333 and .666 bar times
function renderLayout() {
    var barTimeGroup = wrapper.append('g')
        .attr('class', 'bar-times');

    barTimeGroup.selectAll('text')
        .data(barTimes)
        .enter()
        .append('text')
        .style('font-family', 'serif')
        .style('font-style', 'italic')
        .attr('dy', '-3em')
        .attr('x', function(d) {
            return layout.scaleTime(d);
        })
        .text(function(d) {
            return d + '\u2033';
        });
}

/**
 *
 */
{% include_relative _fill-globject.js %}
{% include_relative _globject-text.js %}

function renderPitched() {
    // TODO add class and position in DOM properly
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

function appendDynamics(selection, data, y) {
    selection.append('g')
        .attr('transform', 'translate(0,' + y + ')')
        .selectAll('.dynamic')
        .data(data)
        .enter()
        .append('text')
        .attr('class', 'dynamic')
            .attr('x', function(d, i) {
                return layout.scaleTime(d.duration * d.time);
            })
            .attr('dy', '1em')
            .attr('text-anchor', function(d) {
                return textAnchor(d.time);
            })
            .text(function(d) {
                return dynamics[d.value];
            });
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

    viewCenter = w * 0.5;
}

d3.select(window).on('resize', resize);

function getXByScoreIndex(i) {
    return layout.scaleTime(barTimes[i]);
}

function scrollScoreToIndex(i) {
    var index = (typeof i === 'undefined') ? VS.score.pointer : i;
    var x = viewCenter - getXByScoreIndex(index);

    wrapper
        // .transition()
        // .ease(d3.easeLinear)
        // .duration(300)
        .attr('transform', 'translate(' + x + ',' + 120 + ')');
}

/**
 * Populate score
 */
for (var i = 0; i < barTimes.length; i++) {
    VS.score.add(barTimes[i] * 1000, scrollScoreToIndex, [i]);
}

/**
 * Initialize score
 */
d3.select(window).on('load', function() {
    resize();
    scrollScoreToIndex(0);
    renderLayout();
    renderPitched();
    renderPercussion();
});

/**
 * Score controls
 */
VS.control.hooks.add('stop', scrollScoreToIndex);
VS.control.hooks.add('step', scrollScoreToIndex);
VS.control.hooks.add('pause', scrollScoreToIndex);
