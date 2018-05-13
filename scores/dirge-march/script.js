---
layout: compress-js
---

// TODO scroll globject layer (and percussion dynamics) to show duration of phrases and transformation over time
// rhythms would be still be generated in boxes but could be cued in and out CueSymbol#blink
// may also solve issues of multiple globjects, timing, transitions
var timeScale = 3;

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
            y1: 16,
            y2: 60 + 16,
            dynamics: 60 + 60 + 24
        }
    };

var dynamics = VS.dictionary.Bravura.dynamics;

// Wrap in IIFE to aid in linting
var globjects = (function() {
    return {% include_relative _globjects.json %};
}());

{% include_relative _globjects.js %}
{% include_relative _rhythms.js %}

// TODO do score generation
var score2 = (function() {
    return {% include_relative _score.json %};
}());
{% include_relative _pitched-part.js %}
{% include_relative _settings.js %}
transposeBy += scoreSettings.pitchClasses.transposition;

var svg = d3.select('svg');

var wrapper = svg.append('g')
    .attr('class', 'wrapper')
    .classed('debug', debug);
    // .attr('transform', 'translate(' + layout.margin.left + ',' + layout.margin.top + ')');

/**
 * Rhythm test
 */
var percussionParts = wrapper.append('g')
    .attr('transform', 'translate(' + 0 + ',' + layout.perc.y + ')')
    .attr('class', 'percussion-parts');

var tempoText = percussionParts.append('text')
    .attr('class', 'tempo-text');

tempoText.append('tspan')
    .text(stemmed['1']);

var perc1 = percussionParts.append('g')
    .attr('transform', 'translate(' + 0 + ',' + layout.perc.y1 + ')');

var perc2 = percussionParts.append('g')
    .attr('transform', 'translate(' + 0 + ',' + layout.perc.y2 + ')');

percussionParts.selectAll('g').call(function(selection) {
    selection.append('text')
        .style('font-family', 'Bravura')
        .attr('x', -22)
        .attr('y', 22)
        .text('\ue069');

    function createRhythmCell(g) {
        var cell = g.append('g')
            // .attr('transform', 'translate(' + 22 + ',' + 0 + ')')
            .attr('class', 'rhythm');

        cell.append('rect')
            .attr('height', 45)
            .attr('stroke', '#888')
            .attr('fill', 'none');

        cell.append('text')
            .attr('dx', 11)
            .attr('y', 35);
    }

    // create two rhythm cells
    selection.call(createRhythmCell);
    selection.call(createRhythmCell);
});

var percDynamics = percussionParts.append('g')
    .attr('transform', 'translate(0,' + layout.perc.dynamics + ')');

function textAnchor(t) {
    var a = 'middle';

    if (t === 0) {
        a = 'start';
    } else if (t === 1) {
        a = 'end';
    }

    return a;
}

var globject = VS.globject()
    .width(globjectWidth)
    .height(globjectHeight)
    .curve(d3.curveCardinalClosed.tension(0.3));

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
function renderLayout() {
    var barTimeGroup = wrapper.append('g')
        .attr('class', 'bar-times');

    barTimeGroup.selectAll('text')
        .data(score2)
        .enter()
        .append('text')
        .style('font-family', 'serif')
        .style('font-style', 'italic')
        .attr('dy', '-3em')
        .attr('x', function(d) {
            return d.time * timeScale;
        })
        .text(function(d) {
            return d.time + '\u2033';
        });
}

/**
 *
 */
{% include_relative _fill-globject.js %}
{% include_relative _globject-text.js %}
{% include_relative _append-pitched-dynamics.js %}

function renderPitched() {
    // TODO add class and position in DOM properly
    var pitchedLayer = wrapper.append('g')
        .attr('class', 'pitched-part');

    pitchedLayer.call(pitchedPart.init);
    pitchedPart.draw();
}

// function update(index, isControlEvent) {
//     var bar = score[index];
//
//     /**
//      * Rhythms
//      * TODO stash creation functions elsewhere?
//      * NOTE tempo and bar are in update scope
//      */
//     function createRhythm() {
//         var selection = d3.select(this),
//             textEl = selection.select('text');
//
//         textEl.selectAll('tspan').remove();
//
//         if (!tempo) {
//             return;
//         }
//
//         var extent = bar.percussion.rhythmRange;
//         var randRhythm = VS.getItem(rhythms.filter(function(r, i) {
//             var inRange = extent[0] <= i && i <= extent[1];
//             return r !== percRhythm && inRange; // prevent duplicates within each part
//         }));
//
//         percRhythm = randRhythm;
//
//         var symbols = randRhythm.split(',');
//
//         for (var si = 0; si < symbols.length; si++) {
//             var symbol = symbols[si],
//                 spacing = 0,
//                 dy = symbol === 'r0.5' || symbol === 'r0.5.' ? 0.4 : 0;
//
//             if (symbol === 'trip') {
//                 spacing = -6;
//             } else if (symbol === '1.') {
//                 spacing = -5;
//             }
//
//             textEl.append('tspan')
//                 .style('letter-spacing', spacing)
//                 .style('baseline-shift', dy + 'em')
//                 .text(stemmed[symbol]);
//         }
//
//         var textWidth = textEl.node().getBBox().width;
//         // TODO set d.width
//
//         selection.select('rect').attr('width', textWidth + 22);
//     }
//
//     function spacePerc(d, i) {
//         var selection = d3.select(this);
//
//         var width = selection.node().getBBox().width;
//         var xOffset = percPos + (i * 11);
//         percPos += width;
//         // TODO get d.width
//
//         selection.attr('transform', 'translate(' + xOffset + ',' + 0 + ')');
//     }
//
//     var percPos = 0;
//     var percRhythm = '';
//     perc1.selectAll('.rhythm')
//         .each(createRhythm)
//         .each(spacePerc);
//
//     percPos = 0;
//     percRhythm = '';
//     perc2.selectAll('.rhythm')
//         .each(createRhythm)
//         .each(spacePerc);
//
//     /**
//      * Percussion dynamics
//      */
//     percDynamics.selectAll('.dynamic').remove();
//
//     if (bar.percussion.dynamics) {
//         percDynamics.selectAll('.dynamic')
//             .data(bar.percussion.dynamics)
//             .enter()
//             .append('text')
//                 .attr('class', 'dynamic')
//                 .attr('x', function(d, i) {
//                     return globjectWidth * d.time;
//                 })
//                 .attr('text-anchor', function(d) {
//                     return textAnchor(d.time);
//                 })
//                 .text(function(d) {
//                     return dynamics[d.value];
//                 });
//     }
// }

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
    return score2[i].time * timeScale;
}

function scrollScoreToIndex(i) {
    var x = viewCenter - getXByScoreIndex(i);

    wrapper
        // .transition()
        // .ease(d3.easeLinear)
        // .duration(300)
        .attr('transform', 'translate(' + x + ',' + 120 + ')');
}

/**
 * Populate score
 */
for (var i = 0; i < score2.length; i++) {
    VS.score.add(score2[i].time * 1000, scrollScoreToIndex, [i]);
}

/**
 * Initialize score
 */
d3.select(window).on('load', function() {
    resize();
    scrollScoreToIndex(0);
    renderLayout();
    renderPitched();
});

/**
 * Score controls
 */
VS.control.stopCallback = VS.control.pauseCallback = VS.control.stepCallback = function() {
    scrollScoreToIndex(VS.score.pointer);
};
