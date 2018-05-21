---
layout: compress-js
---

var timeScale = 5;

var width = 480,
    height = 480,
    globjectWidth = 240,
    globjectHeight = 90,
    debug = +VS.getQueryString('debug') === 1 || false,
    transposeBy = 2,
    layout = {
        scale: 1,
        margin: {
            left: 0,
            top: 0
        },
        globjects: {
            top: 16
        },
        perc: {
            y: 220,
            dynamics: 60 + 60 + 24
        }
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
transposeBy += scoreOptions.transposition;

var svg = d3.select('svg');

var wrapper = svg.append('g')
    .attr('class', 'wrapper')
    .classed('debug', debug);
    // .attr('transform', 'translate(' + layout.margin.left + ',' + layout.margin.top + ')');

function textAnchor(t) {
    var a = 'middle';

    if (t === 0) {
        a = 'start';
    } else if (t === 1) {
        a = 'end';
    }

    return a;
}

/**
 *
 */
function makePhrase(type, set) {
    function coin(prob) {
        return Math.random() < (prob || 0.5);
    }

    return function() {
        var notes = [],
            pc1, pc2;

        if (!type) {
            pc1 = VS.getItem(set) + transposeBy;
            notes.push({ pitch: pc1, duration: VS.getRandExcl(8, 12) });
            notes.push({ pitch: pc1, duration: 0 });
        } else if (type === 'descending' || type === 'ascending') {
            pc1 = VS.getItem(set) + transposeBy;
            pc2 = VS.getItem(set) + transposeBy + (type === 'descending' ? -12 : 12);
            notes.push({ pitch: pc1, duration: VS.getRandExcl(4, 6) });
            if (coin(0.33)) {
                notes.push({ pitch: pc1, duration: VS.getRandExcl(4, 6) });
            }
            if (coin(0.33)) {
                notes.push({ pitch: pc2, duration: VS.getRandExcl(4, 6) });
            }
            notes.push({ pitch: pc2, duration: 0 });
        } else if (type === 'both') {
            notes.push({ pitch: VS.getItem(set) + transposeBy, duration: VS.getRandExcl(4, 6) });
            notes.push({ pitch: VS.getItem(set) + transposeBy + (coin() ? 12 : 0), duration: VS.getRandExcl(4, 6) });
            notes.push({ pitch: VS.getItem(set) + transposeBy + (coin() ? 12 : 0), duration: 0 });
        }

        return notes;
    };
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
            return d * timeScale;
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
        .attr('class', 'pitched-part');

    pitchedGroup.call(pitchedPart.init);
    pitchedPart.draw();
}

function renderPercussion() {
    var percussionGroup = wrapper.append('g')
        .attr('transform', 'translate(' + 0 + ',' + layout.perc.y + ')')
        .attr('class', 'percussion-parts');

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
                return d.duration * d.time * timeScale;
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
    return barTimes[i] * timeScale;
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
